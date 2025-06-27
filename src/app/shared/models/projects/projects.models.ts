export interface Project {
  id: string;
  title: string;
  dateModified: string;
  isPublic: boolean;
  nodeLicense: string | null;
  description: string;
  tags: string[];
}
