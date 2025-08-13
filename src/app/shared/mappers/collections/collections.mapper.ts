import { JsonApiResponseWithPaging } from '@core/models';
import {
  CollectionSubmissionReviewAction,
  CollectionSubmissionReviewActionJsonApi,
} from '@osf/features/moderation/models';
import { convertToSnakeCase } from '@osf/shared/helpers';
import {
  CollectionContributor,
  CollectionContributorJsonApi,
  CollectionDetails,
  CollectionDetailsResponseJsonApi,
  CollectionProvider,
  CollectionProviderResponseJsonApi,
  CollectionSubmission,
  CollectionSubmissionJsonApi,
  CollectionSubmissionPayload,
  CollectionSubmissionPayloadJsonApi,
  CollectionSubmissionWithGuid,
  CollectionSubmissionWithGuidJsonApi,
  PaginatedData,
} from '@osf/shared/models';

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

  static fromCurrentSubmissionResponse(submission: CollectionSubmissionJsonApi): CollectionSubmission {
    return {
      id: submission.id,
      type: submission.type,
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
      collectionTitle: submission.embeds.collection.data.attributes.title,
      collectionId: submission.embeds.collection.data.relationships.provider.data.id,
    };
  }

  static fromGetCollectionSubmissionsResponse(
    response: JsonApiResponseWithPaging<CollectionSubmissionWithGuidJsonApi[], null>
  ): PaginatedData<CollectionSubmissionWithGuid[]> {
    return {
      data: response.data.map((submission) => ({
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
        creator: submission.embeds.creator
          ? {
              id: submission.embeds.creator.data.id,
              fullName: submission.embeds.creator.data.attributes.full_name,
            }
          : undefined,
      })),
      totalCount: response.links.meta.total,
    };
  }

  static fromGetCollectionSubmissionsActionsResponse(
    response: CollectionSubmissionReviewActionJsonApi[]
  ): CollectionSubmissionReviewAction[] {
    return response.map((action) => ({
      id: action.id,
      type: action.type,
      dateModified: action.attributes.date_modified,
      dateCreated: action.attributes.date_created,
      fromState: action.attributes.from_state,
      toState: action.attributes.to_state,
      trigger: action.attributes.trigger,
      comment: action.attributes.comment,
      targetId: action.relationships.target.data.id,
      targetNodeId: action.relationships.target.data.id.split('-')[0],
      createdBy: action.embeds.creator.data.attributes.full_name,
    }));
  }

  static fromPostCollectionSubmissionsResponse(
    response: CollectionSubmissionWithGuidJsonApi[]
  ): CollectionSubmissionWithGuid[] {
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

  static toCollectionSubmissionRequest(payload: CollectionSubmissionPayload): CollectionSubmissionPayloadJsonApi {
    const collectionId = payload.collectionId;
    const collectionsMetadata = convertToSnakeCase(payload.collectionMetadata);

    return {
      data: {
        type: 'collection-submissions',
        attributes: {
          guid: payload.projectId,
          ...collectionsMetadata,
        },
        relationships: {
          collection: {
            data: {
              id: collectionId,
              type: 'collections',
            },
          },
          creator: {
            data: {
              type: 'users',
              id: payload.userId,
            },
          },
        },
      },
    };
  }
}
