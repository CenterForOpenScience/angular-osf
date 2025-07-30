import { LinkedRegistration, LinkedRegistrationJsonApi } from '../models';

export class LinkedRegistrationsMapper {
  static fromApiResponse(apiRegistration: LinkedRegistrationJsonApi): LinkedRegistration {
    return {
      id: apiRegistration.id,
      title: apiRegistration.attributes.title,
      description: apiRegistration.attributes.description,
      category: apiRegistration.attributes.category,
      dateCreated: apiRegistration.attributes.date_created,
      dateModified: apiRegistration.attributes.date_modified,
      dateRegistered: apiRegistration.attributes.date_registered,
      tags: apiRegistration.attributes.tags || [],
      isPublic: apiRegistration.attributes.public,
      reviewsState: apiRegistration.attributes.reviews_state,
      hasData: apiRegistration.attributes.has_data,
      hasAnalyticCode: apiRegistration.attributes.has_analytic_code,
      hasMaterials: apiRegistration.attributes.has_materials,
      hasPapers: apiRegistration.attributes.has_papers,
      hasSupplements: apiRegistration.attributes.has_supplements,
      withdrawn: apiRegistration.attributes.withdrawn,
      embargoed: apiRegistration.attributes.embargoed,
      pendingWithdrawal: apiRegistration.attributes.pending_withdrawal,
      pendingRegistrationApproval: apiRegistration.attributes.pending_registration_approval,
      registrationSupplement: apiRegistration.attributes.registration_supplement,
      subjects: apiRegistration.attributes.subjects,
      currentUserPermissions: apiRegistration.attributes.current_user_permissions,
    };
  }
}
