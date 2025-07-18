export interface CitationStyleJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    short_title: string | null;
    summary: string | null;
    date_parsed: string;
  };
  links: Record<string, string>;
}
