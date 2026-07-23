import {
  CollectionSubmissionReviewAction,
  CollectionSubmissionReviewActionJsonApi,
} from '@osf/features/moderation/models';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { replaceBadEncodedChars } from '@osf/shared/helpers/format-bad-encoding.helper';
import { CollectionDetails } from '@osf/shared/models/collections/collection-details.model';
import { CollectionDetailsDataJsonApi } from '@osf/shared/models/collections/collection-details-json-api.model';
import { CollectionProvider } from '@osf/shared/models/collections/collection-provider.model';
import { CollectionProviderDataJsonApi } from '@osf/shared/models/collections/collection-provider-json-api.model';
import { CollectionSubmissionPayload } from '@osf/shared/models/collections/collection-submission-payload.model';
import { CollectionSubmissionPayloadJsonApi } from '@osf/shared/models/collections/collection-submission-payload-json-api.model';
import {
  CollectionProjectSubmission,
  CollectionSubmission,
  CollectionSubmissionWithGuid,
} from '@osf/shared/models/collections/collection-submissions.model';
import {
  CollectionSubmissionDataJsonApi,
  CollectionSubmissionWithGuidDataJsonApi,
  CollectionSubmissionWithGuidListResponseJsonApi,
} from '@osf/shared/models/collections/collection-submissions-json-api.model';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { ProjectsMapper } from '../projects';
import { UserMapper } from '../user';

export class CollectionsMapper {
  static fromGetCollectionProviderResponse(response: CollectionProviderDataJsonApi): CollectionProvider {
    return {
      id: response.id,
      type: response.type,
      name: replaceBadEncodedChars(response.attributes.name),
      description: replaceBadEncodedChars(response.attributes.description),
      advisoryBoard: response.attributes.advisory_board,
      example: response.attributes.example,
      domain: response.attributes.domain,
      domainRedirectEnabled: response.attributes.domain_redirect_enabled,
      footerLinks: response.attributes.footer_links,
      emailSupport: response.attributes.email_support,
      facebookAppId: response.attributes.facebook_app_id,
      allowSubmissions: response.attributes.allow_submissions,
      allowCommenting: response.attributes.allow_commenting,
      assets: response.attributes.assets
        ? {
            style: response.attributes.assets.style,
            squareColorTransparent: response.attributes.assets.square_color_transparent,
            squareColorNoTransparent: response.attributes.assets.square_color_no_transparent,
            favicon: response.attributes.assets.favicon,
          }
        : {},
      iri: response.links?.iri,
      shareSource: response.attributes.share_source,
      sharePublishType: response.attributes.share_publish_type,
      permissions: response.attributes.permissions,
      reviewsWorkflow: response.attributes.reviews_workflow,
      primaryCollection: {
        id: response.relationships.primary_collection.data!.id,
        type: response.relationships.primary_collection.data!.type,
      },
      defaultLicenseId: response.attributes?.default_license_id,
      brand: response.embeds.brand.data
        ? {
            id: response.embeds.brand.data.id,
            name: replaceBadEncodedChars(response.embeds.brand.data.attributes.name),
            heroLogoImageUrl: response.embeds.brand.data.attributes.hero_logo_image,
            topNavLogoImageUrl: response.embeds.brand.data.attributes.topnav_logo_image,
            heroBackgroundImageUrl: response.embeds.brand.data.attributes.hero_background_image,
            primaryColor: response.embeds.brand.data.attributes.primary_color,
            secondaryColor: response.embeds.brand.data.attributes.secondary_color,
            backgroundColor: response.embeds.brand.data.attributes.background_color,
          }
        : null,
      requiredMetadataTemplate: response.embeds.required_metadata_template?.data ?? null,
    };
  }

  static fromGetCollectionDetailsResponse(response: CollectionDetailsDataJsonApi): CollectionDetails {
    return {
      id: response.id,
      type: response.type,
      iri: response.links?.iri,
      title: replaceBadEncodedChars(response.attributes.title),
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      bookmarks: response.attributes.bookmarks,
      isPromoted: response.attributes.is_promoted,
      isPublic: response.attributes.is_public,
    };
  }

  static fromCurrentSubmissionResponse(submission: CollectionSubmissionDataJsonApi): CollectionSubmission {
    return {
      id: submission.id,
      type: submission.type,
      reviewsState: submission.attributes.reviews_state,
      collectionTitle: replaceBadEncodedChars(submission.embeds.collection.data.attributes.title),
      collectionId: submission.embeds.collection.data.relationships.provider.data.id,
      requiredMetadataTemplateId:
        submission.embeds.collection.data.relationships.required_metadata_template?.data?.id ?? null,
    };
  }

  static fromGetCollectionSubmissionsResponse(
    response: CollectionSubmissionWithGuidListResponseJsonApi
  ): PaginatedData<CollectionSubmissionWithGuid[]> {
    return {
      data: response.data.map((submission) => {
        const creator = UserMapper.getUserInfo(submission.embeds.creator);

        return {
          id: submission.id,
          type: submission.type,
          nodeId: submission.embeds.guid.data.id,
          nodeUrl: submission.embeds.guid.data.links.html,
          title: replaceBadEncodedChars(submission.embeds.guid.data.attributes.title),
          description: replaceBadEncodedChars(submission.embeds.guid.data.attributes.description),
          category: submission.embeds.guid.data.attributes.category,
          dateCreated: submission.embeds.guid.data.attributes.date_created,
          dateModified: submission.embeds.guid.data.attributes.date_modified,
          public: submission.embeds.guid.data.attributes.public,
          reviewsState: submission.attributes.reviews_state,
          creator: creator
            ? {
                id: creator?.id,
                fullName: creator?.fullName,
              }
            : undefined,
        } as CollectionSubmissionWithGuid;
      }),
      totalCount: response.meta.total,
      pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
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
      createdBy: UserMapper.getUserInfo(action.embeds.creator)?.fullName || '',
    }));
  }

  static getProjectSubmission(data: CollectionSubmissionWithGuidDataJsonApi): CollectionProjectSubmission {
    const project = ProjectsMapper.fromProjectResponse(data.embeds.guid.data);
    const submission: CollectionSubmissionWithGuid = {
      id: data.id,
      type: data.type,
      nodeId: data.embeds.guid.data.id,
      nodeUrl: data.embeds.guid.data.links.html,
      title: replaceBadEncodedChars(data.embeds.guid.data.attributes.title),
      description: replaceBadEncodedChars(data.embeds.guid.data.attributes.description),
      category: data.embeds.guid.data.attributes.category,
      dateCreated: data.embeds.guid.data.attributes.date_created,
      dateModified: data.embeds.guid.data.attributes.date_modified,
      public: data.embeds.guid.data.attributes.public,
      reviewsState: data.attributes.reviews_state,
      contributors: [] as ContributorModel[],
    };

    return { submission, project };
  }

  static toCollectionSubmissionRequest(payload: CollectionSubmissionPayload): CollectionSubmissionPayloadJsonApi {
    return {
      data: {
        type: 'collection-submissions',
        attributes: {
          guid: payload.projectId,
        },
        relationships: {
          collection: {
            data: {
              id: payload.collectionId,
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
