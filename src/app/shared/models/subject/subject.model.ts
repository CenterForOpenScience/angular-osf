export interface SubjectModel {
  id: string;
  name: string;
  children?: SubjectModel[];
  parent?: SubjectModel | null;
  expanded?: boolean;
  iri?: string;
}
