export interface RelatedCountsModel {
  id: string;
  isPublic: boolean;
  forksCount: number;
  linksToCount: number;
  templateCount: number;
  lastFetched?: number;
}
