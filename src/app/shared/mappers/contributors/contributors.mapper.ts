import { AddContributorType, ContributorPermission } from '@osf/shared/enums';
import {
  ContributorAddModel,
  ContributorAddRequestModel,
  ContributorModel,
  ContributorResponse,
  PaginatedData,
  ResponseJsonApi,
  UserDataJsonApi,
} from '@osf/shared/models';

export class ContributorsMapper {
  static fromResponse(response: ContributorResponse[]): ContributorModel[] {
    return response.map((contributor) => ({
      id: contributor.id,
      userId: contributor.embeds?.users?.data?.id || '',
      type: contributor.type,
      isBibliographic: contributor.attributes.bibliographic,
      isUnregisteredContributor: !!contributor.attributes.unregistered_contributor,
      isCurator: contributor.attributes.is_curator,
      permission: contributor.attributes.permission,
      fullName: contributor.embeds?.users?.data?.attributes?.full_name || '',
      givenName: contributor.embeds?.users?.data?.attributes?.given_name || '',
      familyName: contributor.embeds?.users?.data?.attributes?.family_name || '',
      education: contributor.embeds?.users?.data?.attributes?.education || '',
      employment: contributor.embeds?.users?.data?.attributes?.employment || '',
    }));
  }

  static fromUsersWithPaginationGetResponse(
    response: ResponseJsonApi<UserDataJsonApi[]>
  ): PaginatedData<ContributorAddModel[]> {
    return {
      data: response.data.map(
        (user) =>
          ({
            id: user.id,
            fullName: user.attributes.full_name,
            isBibliographic: false,
            permission: ContributorPermission.Read,
          }) as ContributorAddModel
      ),
      totalCount: response.meta.total,
    };
  }

  static fromContributorResponse(response: ContributorResponse): ContributorModel {
    return {
      id: response.id,
      userId: response.embeds.users.data.id,
      type: response.type,
      isBibliographic: response.attributes.bibliographic,
      isCurator: response.attributes.is_curator,
      isUnregisteredContributor: !!response.attributes.unregistered_contributor,
      permission: response.attributes.permission,
      fullName: response.embeds.users.data.attributes.full_name,
      givenName: response.embeds.users.data.attributes.given_name,
      familyName: response.embeds.users.data.attributes.family_name,
      education: response.embeds.users.data.attributes.education,
      employment: response.embeds.users.data.attributes.employment,
    };
  }

  static toContributorAddRequest(
    model: ContributorAddModel,
    type = AddContributorType.Registered
  ): ContributorAddRequestModel {
    if (type === AddContributorType.Registered) {
      return {
        type: 'contributors',
        attributes: {
          bibliographic: model.isBibliographic,
          permission: model.permission,
          id: model.id,
        },
        relationships: {
          users: {
            data: {
              id: model.id,
              type: 'users',
            },
          },
        },
      };
    } else {
      return {
        type: 'contributors',
        attributes: {
          bibliographic: model.isBibliographic,
          permission: model.permission,
          full_name: model.fullName,
          email: model.email,
        },
        relationships: {},
      };
    }
  }
}
