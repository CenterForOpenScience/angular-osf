export interface Project {
  id: string;
  title: string;
  children?: Project[];
}
