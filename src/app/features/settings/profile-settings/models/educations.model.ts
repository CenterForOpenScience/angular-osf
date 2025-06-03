export interface EducationForm {
  institution: string;
  department: string;
  degree: string;
  startDate: Date;
  endDate: Date | null;
  ongoing: boolean;
}
