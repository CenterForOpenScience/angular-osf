export interface Education {
  degree: string;
  endYear: string | null;
  ongoing: boolean;
  endMonth: number | null;
  startYear: number;
  department: string;
  startMonth: number;
  institution: string;
}

export interface EducationForm {
  institution: string;
  department: string;
  degree: string;
  startDate: Date;
  endDate: Date | null;
  ongoing: boolean;
}
