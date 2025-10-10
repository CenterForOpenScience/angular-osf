import { UserDataErrorResponseJsonApi } from '@osf/shared/models';

export interface ReviewActionJsonApi {
  id: string;
  type: 'review-actions';
  attributes: ReviewActionAttributesJsonApi;
  embeds: {
    creator: UserDataErrorResponseJsonApi;
    target: {
      data: PreprintModelJsonApi;
    };
    provider: {
      data: ProviderModelJsonApi;
    };
  };
}

export interface ReviewActionAttributesJsonApi {
  trigger: string;
  comment: string;
  from_state: string;
  to_state: string;
  date_created: string;
  date_modified: string;
  auto: boolean;
}

export interface UserModelJsonApi {
  id: string;
  type: 'users';
  attributes: UserAttributesJsonApi;
}

export interface UserAttributesJsonApi {
  full_name: string;
}

export interface PreprintModelJsonApi {
  id: string;
  type: 'preprints';
  attributes: PreprintAttributesJsonApi;
}

export interface PreprintAttributesJsonApi {
  title: string;
}

export interface ProviderModelJsonApi {
  id: string;
  attributes: {
    name: string;
  };
}
