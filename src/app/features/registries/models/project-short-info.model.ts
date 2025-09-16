export interface ProjectShortInfoModel {
  id: string;
  title: string;
  children?: ProjectShortInfoModel[];
}
