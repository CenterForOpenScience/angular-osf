export interface CitationStyle {
  id: string;
  title: string;
  shortTitle: string;
  summary: string | null;
  hasBibliography: boolean;
  parentStyle: string;
}
