export type Frontmatter = {
  title: string;
  description: string;
  date: Date;
  header?: boolean;
  lastUpdate?: Date;
  [key: string]: unknown;
};

export type FrontmatterEntry = readonly [string, Frontmatter];
