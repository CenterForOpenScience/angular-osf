import { CurrentResourceType } from '@osf/shared/enums';
import {
  ProviderShortInfoModel,
  RegistrationNodeAttributesJsonApi,
  RegistrationNodeModel,
  RegistrationResponses,
  RegistrationResponsesJsonApi,
  RegistryProviderDetailsJsonApi,
} from '@osf/shared/models';

export class RegistrationNodeMapper {
  static getRegistrationNodeAttributes(
    id: string,
    attributes: RegistrationNodeAttributesJsonApi
  ): RegistrationNodeModel {
    return {
      id,
      type: 'registrations',
      accessRequestsEnabled: attributes.access_requests_enabled,
      archiving: attributes.archiving,
      articleDoi: attributes.article_doi,
      category: attributes.category,
      currentUserIsContributor: attributes.current_user_is_contributor,
      currentUserPermissions: attributes.current_user_permissions || [],
      customCitation: attributes.custom_citation,
      dateCreated: attributes.date_created,
      dateModified: attributes.date_modified,
      dateRegistered: attributes.date_registered,
      dateWithdrawn: attributes.date_withdrawn,
      description: attributes.description,
      embargoed: attributes.embargoed,
      embargoEndDate: attributes.embargo_end_date,
      hasAnalyticCode: attributes.has_analytic_code,
      hasData: attributes.has_data,
      hasMaterials: attributes.has_materials,
      hasPapers: attributes.has_papers,
      hasProject: attributes.has_project,
      hasSupplements: attributes.has_supplements,
      iaUrl: attributes.ia_url,
      isCollection: attributes.collection,
      isFork: attributes.fork,
      isPreprint: attributes.preprint,
      isPublic: attributes.public,
      isRegistration: attributes.registration,
      nodeLicense: {
        copyrightHolders: attributes.node_license?.copyright_holders || null,
        year: attributes.node_license?.year || null,
      },
      pendingEmbargoApproval: attributes.pending_embargo_approval,
      pendingEmbargoTerminationApproval: attributes.pending_embargo_termination_approval,
      pendingRegistrationApproval: attributes.pending_registration_approval,
      pendingWithdrawal: attributes.pending_withdrawal,
      providerSpecificMetadata: attributes.provider_specific_metadata,
      registeredMeta: attributes.registered_meta,
      registrationResponses: this.getRegistrationResponses(attributes.registration_responses),
      registrationSupplement: attributes.registration_supplement,
      reviewsState: attributes.reviews_state,
      revisionState: attributes.revision_state,
      tags: attributes.tags || [],
      title: attributes.title,
      wikiEnabled: attributes.wiki_enabled,
      withdrawalJustification: attributes.withdrawal_justification,
      withdrawn: attributes.withdrawn,
    };
  }

  static getRegistrationResponses(response: RegistrationResponsesJsonApi): RegistrationResponses {
    return {
      summary: response.summary,
      uploader: response.uploader.map((uploadItem) => ({
        fileId: uploadItem.file_id,
        fileName: uploadItem.file_name,
        fileUrls: uploadItem.file_urls,
        fileHashes: uploadItem.file_hashes,
      })),
    };
  }

  static getRegistrationProviderShortInfo(provider?: RegistryProviderDetailsJsonApi): ProviderShortInfoModel {
    if (!provider) {
      return {} as ProviderShortInfoModel;
    }

    return {
      id: provider.id,
      name: provider.attributes.name,
      permissions: provider.attributes.permissions,
      type: CurrentResourceType.Registrations,
      reviewsWorkflow: provider.attributes.reviews_workflow,
    };
  }
}
