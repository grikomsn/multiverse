import { withPdfMetadata } from "../lib/resume/pdf-metadata"
import { loadIndex } from "./data"

/**
 * /resume.pdf: the first request per Worker version renders /resume/ats with Browser
 * Run, stores it in R2 and the edge cache; the latest good PDF is the fallback.
 */
export async function handleResumePdf(request: Request, env: Env): Promise<Response> {
  const versionId = env.CF_VERSION_METADATA.id || "development"
  const cacheKey = getCacheKey(request, versionId)
  const edgeCache = (
    caches as CacheStorage & {
      readonly default: Cache
    }
  ).default

  const edgeCached = await edgeCache.match(cacheKey)
  if (edgeCached) {
    return createClientResponse(edgeCached, "EDGE")
  }

  const objectKey = `${PDF_BUILDS_PREFIX}/${versionId}.pdf`
  const stored = await env.BLOB.get(objectKey)
  if (stored) {
    const response = createCacheableResponse(
      stored.body,
      stored.customMetadata?.versionId || versionId,
    )
    await edgeCache.put(cacheKey, response.clone())
    return createClientResponse(response, "R2")
  }

  try {
    const rendered = await env.BROWSER.quickAction("pdf", {
      url: getRenderUrl(request),
      cacheTTL: 0,
      emulateMediaType: "print",
      gotoOptions: {
        timeout: 60_000,
        waitUntil: "networkidle0",
      },
      pdfOptions: {
        format: "a4",
        outline: true,
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      },
      waitForSelector: {
        selector: "#resume-title",
        timeout: 30_000,
        visible: true,
      },
    })

    if (!rendered.ok) {
      throw new Error(`Browser Run returned ${rendered.status}: ${await rendered.text()}`)
    }

    const renderedPdf = await rendered.arrayBuffer()
    if (!isPdf(renderedPdf)) {
      throw new Error("Browser Run returned an invalid PDF")
    }
    const pdf = await addMetadata(renderedPdf, env, request)

    const generatedAt = new Date().toISOString()
    const putOptions: R2PutOptions = {
      customMetadata: { generatedAt, versionId },
      httpMetadata: {
        contentDisposition: 'attachment; filename="resume.pdf"',
        contentType: "application/pdf",
      },
    }

    await Promise.all([
      env.BLOB.put(objectKey, pdf, putOptions),
      env.BLOB.put(LATEST_PDF_KEY, pdf, putOptions),
    ])

    const response = createCacheableResponse(pdf, versionId)
    await edgeCache.put(cacheKey, response.clone())
    return createClientResponse(response, "MISS")
  } catch (error) {
    console.error("Resume PDF generation failed", error)

    const latest = await env.BLOB.get(LATEST_PDF_KEY)
    if (latest) {
      const response = createCacheableResponse(
        latest.body,
        latest.customMetadata?.versionId || "stale",
      )
      return createClientResponse(response, "STALE")
    }

    return new Response("Resume PDF is temporarily unavailable", {
      status: 502,
    })
  }
}

/** Author, subject and keywords from Sanity; the plain render if that fails. */
async function addMetadata(
  pdf: ArrayBuffer,
  env: Env,
  request: Request,
): Promise<ArrayBuffer | Uint8Array> {
  try {
    const { resume, origin } = await loadIndex(env, request)
    return await withPdfMetadata(pdf, {
      title: `${resume.name} – Resume`,
      author: resume.name,
      subject: [`Resume of ${resume.name}`, resume.headline].filter(Boolean).join(", "),
      keywords: resume.keywords,
      creator: `${origin}/resume`,
    })
  } catch (error) {
    console.error("Resume PDF metadata failed", error)
    return pdf
  }
}

function createCacheableResponse(body: BodyInit, versionId: string): Response {
  return new Response(body, {
    headers: {
      "Cache-Control": `public, max-age=${EDGE_CACHE_TTL_SECONDS}, immutable`,
      "Content-Disposition": 'attachment; filename="resume.pdf"',
      "Content-Type": "application/pdf",
      ETag: `"resume-${versionId.replaceAll('"', "")}"`,
      "X-Resume-PDF-Version": versionId,
    },
  })
}

function createClientResponse(
  response: Response,
  cacheStatus: "EDGE" | "MISS" | "R2" | "STALE",
): Response {
  const headers = new Headers(response.headers)
  headers.set("Cache-Control", "public, max-age=0, must-revalidate")
  headers.set("X-Resume-PDF-Cache", cacheStatus)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function getCacheKey(request: Request, versionId: string): Request {
  const cacheUrl = new URL(request.url)
  cacheUrl.pathname = `${EDGE_CACHE_PATH}/${encodeURIComponent(versionId)}.pdf`
  cacheUrl.search = ""
  return new Request(cacheUrl, { method: "GET" })
}

function getRenderUrl(request: Request): string {
  const requestUrl = new URL(request.url)
  const isLocal =
    requestUrl.hostname === "127.0.0.1" ||
    requestUrl.hostname === "localhost" ||
    requestUrl.hostname === "::1"
  const baseUrl = isLocal ? PRODUCTION_RESUME_URL : requestUrl.origin
  return new URL("/resume/ats", baseUrl).toString()
}

function isPdf(value: ArrayBuffer): boolean {
  if (value.byteLength < MINIMUM_PDF_BYTES) {
    return false
  }

  const signature = new Uint8Array(value, 0, 4)
  return String.fromCharCode(...signature) === "%PDF"
}

const EDGE_CACHE_PATH = "/__resume-pdf-cache"
const EDGE_CACHE_TTL_SECONDS = 31_536_000
const LATEST_PDF_KEY = "resume/latest.pdf"
const MINIMUM_PDF_BYTES = 10_000
const PDF_BUILDS_PREFIX = "resume/builds"
const PRODUCTION_RESUME_URL = "https://nibras.co"
