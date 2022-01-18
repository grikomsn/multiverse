export type Frontmatter = {
  title: string;
  description: string;
  date: Date;
  header?: boolean;
  lastUpdate?: Date;
  redirect?: string;
  [key: string]: unknown;
};

export type FrontmatterEntry = readonly [string, Frontmatter];
