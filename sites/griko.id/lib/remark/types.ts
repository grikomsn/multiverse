export type Frontmatter = {
  title: string;
  description: string;
  date: Date;
  lastUpdate?: Date;
};

export type FrontmatterEntry = readonly [string, Frontmatter];
