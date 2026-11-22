declare module "prismjs" {
  const Prism: {
    languages: Record<string, unknown>
    highlight(code: string, grammar: unknown, language: string): string
  }
  export default Prism
}

declare module "prismjs/components/index.js" {
  export default function loadLanguages(languages?: string[]): void
}
