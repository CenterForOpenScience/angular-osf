export interface EmploymentForm {
  title: string;
  ongoing: boolean;
  department: string;
  institution: string;
  startDate: Date | string;
  endDate: Date | string | null;
}
