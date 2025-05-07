import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';

export function mapUserUStoUser(user: UserUS): User {
  return {
    id: user.id,
    fullName: user.attributes.full_name,
    givenName: user.attributes.given_name,
    familyName: user.attributes.family_name,
    email: user.attributes.email,
    dateRegistered: new Date(user.attributes.date_registered),
    link: user.links.html,
    iri: user.links.iri,
    socials: user.attributes.social,
    employment: user.attributes.employment?.map((emp) => ({
      title: emp.title,
      department: emp.department,
      institution: emp.institution,
      startDate: new Date(emp.startYear, emp.startMonth - 1),
      endDate: emp.ongoing
        ? new Date()
        : new Date(emp.endYear, emp.endMonth - 1),
      ongoing: emp.ongoing,
    })),
    education: user.attributes.education?.map((edu) => ({
      degree: edu.degree,
      department: edu.department,
      institution: edu.institution,
      startDate: new Date(edu.startYear, edu.startMonth - 1),
      endDate: edu.ongoing
        ? new Date()
        : new Date(edu.endYear, edu.endMonth - 1),
      ongoing: edu.ongoing,
    })),
  };
}
