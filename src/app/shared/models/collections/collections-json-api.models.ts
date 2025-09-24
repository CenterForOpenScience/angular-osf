import { BrandDataJsonApi, CollectionsProviderAttributesJsonApi, JsonApiResponse } from '@shared/models';

export interface CollectionProviderResponseJsonApi {
  id: string;
  type: string;
  attributes: CollectionsProviderAttributesJsonApi;
  embeds: {
    brand: {
      data?: BrandDataJsonApi;
    };
  };
  relationships: {
    primary_collection: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface CollectionDetailsResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    date_created: string;
    date_modified: string;
    bookmarks: boolean;
    is_promoted: boolean;
    is_public: boolean;
    status_choices: string[];
    collected_type_choices: string[];
    volume_choices: string[];
    issue_choices: string[];
    program_area_choices: string[];
    school_type_choices: string[];
    study_design_choices: string[];
    data_type_choices: string[];
    disease_choices: string[];
    grade_levels_choices: string[];
  };
}

export interface CollectionSubmissionJsonApi {
  id: string;
  type: string;
  attributes: {
    reviews_state: string;
    collected_type: string;
    status: string;
    volume: string;
    issue: string;
    program_area: string;
    school_type: string;
    study_design: string;
    data_type: string;
    disease: string;
    grade_levels: string;
  };
  embeds: {
    collection: {
      data: {
        attributes: {
          title: string;
        };
        relationships: {
          provider: {
            data: {
              id: string;
            };
          };
        };
      };
    };
  };
}

export interface CollectionSubmissionWithGuidJsonApi {
  id: string;
  type: string;
  attributes: {
    reviews_state: string;
    collected_type: string;
    status: string;
    volume: string;
    issue: string;
    program_area: string;
    school_type: string;
    study_design: string;
    data_type: string;
    disease: string;
    grade_levels: string;
  };
  embeds: {
    guid: {
      data: {
        id: string;
        type: string;
        attributes: {
          title: string;
          description: string;
          category: string;
          date_created: string;
          date_modified: string;
          public: boolean;
        };
        links: {
          html: string;
        };
        relationships: {
          bibliographic_contributors: {
            links: {
              related: {
                href: string;
              };
            };
          };
        };
      };
    };
    creator?: {
      data: {
        attributes: {
          full_name: string;
        };
        id: string;
      };
    };
  };
  links: {
    meta: {
      total: number;
    };
  };
}

export interface SparseCollectionAttributesJsonApi {
  title: string;
  bookmarks: boolean;
}

export interface SparseCollectionJsonAi {
  id: string;
  attributes: SparseCollectionAttributesJsonApi;
}

export interface SparseCollectionsResponseJsonApi {
  data: SparseCollectionJsonAi[];
}

export interface CollectionDetailsGetResponseJsonApi extends JsonApiResponse<CollectionDetailsResponseJsonApi, null> {
  data: CollectionDetailsResponseJsonApi;
}

export interface CollectionSubmissionsSearchPayloadJsonApi {
  data: {
    attributes: {
      provider: string[];
      studyDesign?: string[];
      schoolType?: string[];
      status?: string[];
      collectedType?: string[];
      volume?: string[];
      issue?: string[];
      programArea?: string[];
      dataType?: string[];
      disease?: string[];
      gradeLevels?: string[];
      q?: string;
    };
  };
  type: string;
}
