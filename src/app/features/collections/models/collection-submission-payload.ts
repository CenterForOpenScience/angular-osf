export interface CollectionSubmissionPayload {
  collectionId: string;
  projectId: string;
  userId: string;
  collectionMetadata: Record<string, string>;
}
