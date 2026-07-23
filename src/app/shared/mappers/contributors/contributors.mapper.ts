import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { ContributorModel, ContributorShortInfoModel } from '@osf/shared/models/contributors/contributor.model';
import { ContributorAddModel } from '@osf/shared/models/contributors/contributor-add.model';
import { ContributorAddRequestModel } from '@osf/shared/models/contributors/contributor-add-request.model';
import { ContributorDataJsonApi } from '@osf/shared/models/contributors/contributor-response-json-api.model';

export class ContributorsMapper {
  static getContributors(response: ContributorDataJsonApi[] | undefined): ContributorModel[] {
    if (!response) {
      return [];
    }

    return response.map((contributor) => this.getContributor(contributor));
  }

  static getContributor(response: ContributorDataJsonApi): ContributorModel {
    const userEmbed = response.embeds?.users;

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

  static toContributorUpdateRequest(model: ContributorModel): ContributorAddRequestModel {
    return {
      id: model.id,
      type: 'contributors',
      attributes: {
        bibliographic: model.isBibliographic,
        permission: model.permission,
        index: model.index,
        id: model.userId,
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
  }
}
