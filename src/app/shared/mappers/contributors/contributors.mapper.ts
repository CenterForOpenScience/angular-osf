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
  static getContributors(response: ContributorDataJsonApi[] | undefined): ContributorModel[] {
    if (!response) {
      return [];
    }

    return response.map((contributor) => this.getContributor(contributor));
  }

  static getContributor(response: ContributorDataJsonApi): ContributorModel {
    const userEmbed = response.embeds.users;
    const errorMeta = userEmbed?.errors && userEmbed.errors.length > 0 ? userEmbed.errors[0]?.meta : null;
    const userData = userEmbed?.data;

    return {
      id: response.id,
      type: response.type,
      isBibliographic: response.attributes.bibliographic,
      isUnregisteredContributor: !!response.attributes.unregistered_contributor,
      isCurator: response.attributes.is_curator,
      permission: response.attributes.permission,
      index: response.attributes.index,
      userId: errorMeta ? response?.id?.split('-')[1] : userData?.id || '',
      fullName: errorMeta ? errorMeta?.full_name : userData?.attributes?.full_name || '',
      givenName: errorMeta ? errorMeta?.given_name : userData?.attributes?.given_name || '',
      familyName: errorMeta ? errorMeta?.family_name : userData?.attributes?.family_name || '',
      education: errorMeta ? [] : userData?.attributes?.education || [],
      employment: errorMeta ? [] : userData?.attributes?.employment || [],
      deactivated: !!errorMeta,
    };
  }

  static getContributorShortInfo(response: ContributorDataJsonApi[] | undefined): ContributorShortInfoModel[] {
    const contributors = this.getContributors(response);

    return contributors.map((contributor) => ({
      id: contributor.id,
      userId: contributor.userId,
      fullName: contributor.fullName,
      isUnregisteredContributor: contributor.isUnregisteredContributor,
      isBibliographic: contributor.isBibliographic,
      index: contributor.index,
      permission: contributor.permission,
    }));
  }

  static getPaginatedUsers(response: ResponseJsonApi<UserDataJsonApi[]>): PaginatedData<ContributorAddModel[]> {
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
      pageSize: response.meta.per_page,
    };
  }

  static toContributorAddRequest(
    model: ContributorAddModel,
    type = AddContributorType.Registered,
    childNodeIds?: string[]
  ): ContributorAddRequestModel {
    if (type === AddContributorType.Registered) {
      return {
        type: 'contributors',
        attributes: {
          bibliographic: model.isBibliographic,
          permission: model.permission,
          index: model.index,
          id: model.id,
          child_nodes: childNodeIds || [],
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
