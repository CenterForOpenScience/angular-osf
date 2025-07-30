export interface Employment {
  title: string;
  institution: string;
  department: string;
  startMonth: number;
  startYear: string | number;
  endMonth: number | null;
  endYear: number | null;
  ongoing: boolean;
}
