import { PDFDocument } from "pdf-lib"

export interface PdfMetadata {
  title: string
  author: string
  subject: string
  keywords: string[]
  creator: string
}

/**
 * Chromium writes only a title. Add author, subject and keywords so applicant tracking systems
 * and file managers show who the resume is for. Tags, outline and text stay as rendered.
 */
export async function withPdfMetadata(pdf: ArrayBuffer, meta: PdfMetadata): Promise<Uint8Array> {
  const document = await PDFDocument.load(pdf, { updateMetadata: false })
  document.setTitle(meta.title, { showInWindowTitleBar: true })
  document.setAuthor(meta.author)
  document.setSubject(meta.subject)
  // pdf-lib joins with spaces, which splits "Tailwind CSS"; commas keep multi-word skills whole.
  document.setKeywords([meta.keywords.join(", ")])
  document.setCreator(meta.creator)
  document.setProducer("Chromium (Cloudflare Browser Run), pdf-lib")
  document.setLanguage("en")
  document.setModificationDate(new Date())
  return document.save({ useObjectStreams: false })
}
