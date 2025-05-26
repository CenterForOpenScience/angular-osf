export interface Employment {
  title: string;
  startYear: string | number;
  startMonth: number;
  endYear: number | null;
  endMonth: number | null;
  ongoing: boolean;
  department: string;
  institution: string;
}

export interface EmploymentForm {
  title: string;
  ongoing: boolean;
  department: string;
  institution: string;
  startDate: Date | string;
  endDate: Date | string | null;
}
