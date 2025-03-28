import {ProjectUS} from '@osf/features/home/models/raw-models/projectUS.entity';
import {ApiData, JsonApiArrayResponse, JsonApiResponse} from '@core/services/json-api/json-api.entity';
import {BibliographicContributorUS} from '@osf/features/home/models/raw-models/bibliographicContributorUS.entity';
import {UserUS} from '@osf/features/home/models/raw-models/userUS.entity';

export type ProjectItem = ApiData<ProjectUS, {
  bibliographic_contributors: JsonApiArrayResponse<ApiData<BibliographicContributorUS, {
    users: JsonApiResponse<ApiData<UserUS, null>>
  }>>
}>
