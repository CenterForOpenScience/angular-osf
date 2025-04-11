import { ProjectUS } from '@osf/features/home/models/raw-models/projectUS.entity';
import {
  ApiData,
  JsonApiResponse,
} from '@core/services/json-api/json-api.entity';
import { BibliographicContributorUS } from '@osf/features/home/models/raw-models/bibliographicContributorUS.entity';
import { UserUS } from '@osf/features/home/models/raw-models/userUS.entity';

export type ProjectItem = ApiData<
  ProjectUS,
  {
    bibliographic_contributors: JsonApiResponse<
      ApiData<
        BibliographicContributorUS,
        {
          users: JsonApiResponse<ApiData<UserUS, null>, null>;
        }
      >[],
      null
    >;
  }
>;
