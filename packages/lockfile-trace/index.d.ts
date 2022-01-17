const trace: Record<
  string,
  {
    matches: string[];
    version: string;
    dependencies?: Record<string, string>;
  }
>;
export default trace;
