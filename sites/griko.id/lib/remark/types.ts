export type Frontmatter = {
  date: Date;
  description: string;
  title: string;
};

export type FrontmatterEntry = readonly [string, Frontmatter];
