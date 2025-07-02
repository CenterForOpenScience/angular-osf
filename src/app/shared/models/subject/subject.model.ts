export interface Subject {
  id: string;
  name: string;
  children?: Subject[];
  parent?: Subject | null;
  expanded?: boolean;
}
