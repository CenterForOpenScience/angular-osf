import { Education } from '@osf/shared/models';
import { findChangedFields } from '@osf/shared/utils';

import { EducationForm } from '../models';

export function mapFormToEducation(education: EducationForm): Education {
  return {
    institution: education.institution,
    department: education.department,
    degree: education.degree,
    startYear: education.startDate?.getFullYear() ?? new Date().getFullYear(),
    startMonth: (education.startDate?.getMonth() ?? 0) + 1,
    endYear: education.ongoing ? null : (education.endDate?.getFullYear() ?? null),
    endMonth: education.ongoing ? null : education.endDate ? education.endDate.getMonth() + 1 : null,
    ongoing: education.ongoing,
  };
}

export function mapEducationToForm(education: Education): EducationForm {
  return {
    institution: education.institution,
    department: education.department,
    degree: education.degree,
    startDate: new Date(+education.startYear, education.startMonth - 1),
    endDate: education.ongoing
      ? null
      : education.endYear && education.endMonth
        ? new Date(+education.endYear, education.endMonth - 1)
        : null,
    ongoing: education.ongoing,
  };
}

export function hasEducationChanges(formEducation: EducationForm, initialEducation: Education): boolean {
  const formattedFormEducation = mapFormToEducation(formEducation);

  const initialForComparison = initialEducation.ongoing
    ? { ...initialEducation, endYear: null, endMonth: null }
    : initialEducation;

  const changedFields = findChangedFields<Education>(formattedFormEducation, initialForComparison);

  return Object.keys(changedFields).length > 0;
}
