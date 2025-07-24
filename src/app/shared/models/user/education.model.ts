export interface Education {
  institution: string;
  department: string;
  degree: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  ongoing: boolean;
}
