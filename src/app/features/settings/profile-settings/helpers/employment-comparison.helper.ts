import { findChangedFields } from '@osf/shared/helpers';
import { Employment } from '@osf/shared/models';

import { EmploymentForm } from '../models';

export function mapFormToEmployment(employment: EmploymentForm): Employment {
  return {
    title: employment.title,
    department: employment.department,
    institution: employment.institution,
    startYear: employment.startDate?.getFullYear() ?? new Date().getFullYear(),
    startMonth: employment.startDate?.getMonth() + 1,
    endYear: employment.ongoing ? null : (employment.endDate?.getFullYear() ?? null),
    endMonth: employment.ongoing ? null : employment.endDate ? employment.endDate.getMonth() + 1 : null,
    ongoing: employment.ongoing,
  };
}

export function mapEmploymentToForm(employment: Employment): EmploymentForm {
  return {
    title: employment.title,
    department: employment.department,
    institution: employment.institution,
    startDate: new Date(+employment.startYear, employment.startMonth - 1),
    endDate: employment.ongoing
      ? null
      : employment.endYear && employment.endMonth
        ? new Date(+employment.endYear, employment.endMonth - 1)
        : null,
    ongoing: employment.ongoing,
  };
}

export function hasEmploymentChanges(formEmployment: EmploymentForm, initialEmployment: Employment): boolean {
  const formattedFormEmployment = mapFormToEmployment(formEmployment);

  const initialForComparison = initialEmployment.ongoing
    ? { ...initialEmployment, endYear: null, endMonth: null }
    : initialEmployment;

  const changedFields = findChangedFields<Employment>(formattedFormEmployment, initialForComparison);

  return Object.keys(changedFields).length > 0;
}
