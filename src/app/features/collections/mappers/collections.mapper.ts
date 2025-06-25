import {
  CollectionContributor,
  CollectionContributorJsonApi,
  CollectionDetails,
  CollectionDetailsResponseJsonApi,
  CollectionProvider,
  CollectionProviderResponseJsonApi,
  CollectionSubmission,
  CollectionSubmissionJsonApi,
} from '@osf/features/collections/models';

export class CollectionsMapper {
  static fromGetCollectionContributorsResponse(response: CollectionContributorJsonApi[]): CollectionContributor[] {
    return response.map((contributor) => ({
      id: contributor.embeds.users.data.id,
      name: contributor.embeds.users.data.attributes.full_name,
      url: contributor.embeds.users.data.links.html,
    }));
  }

  static fromGetCollectionProviderResponse(response: CollectionProviderResponseJsonApi): CollectionProvider {
    return {
      id: response.id,
      type: response.type,
      name: response.attributes.name,
      description: response.attributes.description,
      advisoryBoard: response.attributes.advisory_board,
      example: response.attributes.example,
      domain: response.attributes.domain,
      domainRedirectEnabled: response.attributes.domain_redirect_enabled,
      footerLinks: response.attributes.footer_links,
      emailSupport: response.attributes.email_support,
      facebookAppId: response.attributes.facebook_app_id,
      allowSubmissions: response.attributes.allow_submissions,
      allowCommenting: response.attributes.allow_commenting,
      assets: {
        style: response.attributes.assets.style,
        squareColorTransparent: response.attributes.assets.square_color_transparent,
        squareColorNoTransparent: response.attributes.assets.square_color_no_transparent,
        favicon: response.attributes.assets.favicon,
      },
      shareSource: response.attributes.share_source,
      sharePublishType: response.attributes.share_publish_type,
      permissions: response.attributes.permissions,
      reviewsWorkflow: response.attributes.reviews_workflow,
      primaryCollection: {
        id: response.relationships.primary_collection.data.id,
        type: response.relationships.primary_collection.data.type,
      },
    };
  }

  static fromGetCollectionDetailsResponse(response: CollectionDetailsResponseJsonApi): CollectionDetails {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      bookmarks: response.attributes.bookmarks,
      isPromoted: response.attributes.is_promoted,
      isPublic: response.attributes.is_public,
      filters: {
        status: response.attributes.status_choices,
        collectedType: response.attributes.collected_type_choices,
        volume: response.attributes.volume_choices,
        issue: response.attributes.issue_choices,
        programArea: response.attributes.program_area_choices,
        schoolType: response.attributes.school_type_choices,
        studyDesign: response.attributes.study_design_choices,
        dataType: response.attributes.data_type_choices,
        disease: response.attributes.disease_choices,
        gradeLevels: response.attributes.grade_levels_choices,
      },
    };
  }

  static fromPostCollectionSubmissionsResponse(response: CollectionSubmissionJsonApi[]): CollectionSubmission[] {
    return response.map((submission) => ({
      id: submission.id,
      type: submission.type,
      nodeId: submission.embeds.guid.data.id,
      nodeUrl: submission.embeds.guid.data.links.html,
      title: submission.embeds.guid.data.attributes.title,
      description: submission.embeds.guid.data.attributes.description,
      category: submission.embeds.guid.data.attributes.category,
      dateCreated: submission.embeds.guid.data.attributes.date_created,
      dateModified: submission.embeds.guid.data.attributes.date_modified,
      public: submission.embeds.guid.data.attributes.public,
      reviewsState: submission.attributes.reviews_state,
      collectedType: submission.attributes.collected_type,
      status: submission.attributes.status,
      volume: submission.attributes.volume,
      issue: submission.attributes.issue,
      programArea: submission.attributes.program_area,
      schoolType: submission.attributes.school_type,
      studyDesign: submission.attributes.study_design,
      dataType: submission.attributes.data_type,
      disease: submission.attributes.disease,
      gradeLevels: submission.attributes.grade_levels,
      contributors: [] as CollectionContributor[],
    }));
  }
}
