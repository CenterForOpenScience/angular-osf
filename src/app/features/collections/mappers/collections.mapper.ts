import { CollectionProvider, CollectionProviderResponseJsonApi } from '@osf/features/collections/models';

export class CollectionsMapper {
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
}
