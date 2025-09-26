import { AddContributorType, ContributorPermission } from '@osf/shared/enums';
import {
  ContributorAddModel,
  ContributorAddRequestModel,
  ContributorDataJsonApi,
  ContributorModel,
  ContributorShortInfoModel,
  PaginatedData,
  ResponseJsonApi,
  UserDataJsonApi,
} from '@osf/shared/models';

export class ContributorsMapper {
  static fromResponse(response: ContributorDataJsonApi[] | undefined): ContributorModel[] {
    if (!response) {
      return [];
    }

    return response
      .filter((contributor) => !contributor?.embeds?.users?.errors)
      .map((contributor) => this.fromContributorResponse(contributor));
  }

  static fromContributorResponse(response: ContributorDataJsonApi): ContributorModel {
    return {
      id: response.id,
      userId: response.embeds?.users?.data?.id || '',
      type: response.type,
      isBibliographic: response.attributes.bibliographic,
      isUnregisteredContributor: !!response.attributes.unregistered_contributor,
      isCurator: response.attributes.is_curator,
      permission: response.attributes.permission,
      index: response.attributes.index,
      fullName: response.embeds?.users?.data?.attributes?.full_name || '',
      givenName: response.embeds?.users?.data?.attributes?.given_name || '',
      familyName: response.embeds?.users?.data?.attributes?.family_name || '',
      education: response.embeds?.users?.data?.attributes?.education || '',
      employment: response.embeds?.users?.data?.attributes?.employment || '',
    };
  }

  static getContributorShortInfo(response: ContributorDataJsonApi[] | undefined): ContributorShortInfoModel[] {
    const contributors = this.fromResponse(response);

    return contributors.map((contributor) => ({
      id: contributor.id,
      userId: contributor.userId,
      fullName: contributor.fullName,
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
            isBibliographic: true,
            permission: ContributorPermission.Write,
          }) as ContributorAddModel
      ),
      totalCount: response.meta.total,
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
