import { ApiData, FileLinks, FileRelationshipsResponse, FileResponse, JsonApiResponse } from '@shared/models';

export type GetFileTargetResponse = JsonApiResponse<
  ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>,
  null
>;

export interface FileTargetResponse {
  target: JsonApiResponse<
    ApiData<
      {
        title: string;
        description: string;
        category: string;
        custom_citation: string;
        date_created: string;
        date_modified: string;
        registration: boolean;
        preprint: boolean;
        fork: boolean;
        collection: boolean;
        tags: string[];
        node_license: string;
        analytics_key: string;
        current_user_can_comment: boolean;
        current_user_permissions: string[];
        current_user_is_contributor: boolean;
        current_user_is_contributor_or_group_member: boolean;
        wiki_enabled: boolean;
        public: boolean;
      },
      null,
      null,
      null
    >,
    null
  >;
}
