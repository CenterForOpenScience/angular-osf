export interface EmploymentForm {
  title: string;
  ongoing: boolean;
  department: string;
  institution: string;
  startDate: Date;
  endDate: Date | null;
}
