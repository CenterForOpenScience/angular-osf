export interface CitationStyleJsonApi {
  id: string;
  title: string;
  short_title: string;
  summary: string | null;
  has_bibliography: boolean;
  parent_style: string;
}

export interface CitationStylesJsonApiResponse {
  styles: CitationStyleJsonApi[];
}
