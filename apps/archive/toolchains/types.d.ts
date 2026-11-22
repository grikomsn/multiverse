/** One toolchain's compile step: an edition stylesheet in, plain CSS out. */
export type Compile = (input: {
  /** The stylesheet without its `@toolchain` line. */
  css: string
  /** Its absolute path. */
  from: string
  /** Absolute path of the edition's `tailwind.config.cjs`. */
  config: string
}) => Promise<{
  css: string
  /** Files to watch in dev. */
  watch: string[]
  /** Globs of the markup the CSS was generated from. */
  content: string[]
}>
