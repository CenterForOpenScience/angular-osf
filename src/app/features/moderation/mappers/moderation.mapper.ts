import { JsonApiResponseWithPaging, UserGetResponse } from '@osf/core/models';
import { PaginatedData } from '@osf/shared/models';

import { ModeratorPermission } from '../enums';
import { ModeratorAddModel, ModeratorDataJsonApi, ModeratorModel } from '../models';

export class ModerationMapper {
  static fromModeratorResponse(response: ModeratorDataJsonApi): ModeratorModel {
    return {
      id: response.id,
      userId: response.embeds.user.data.id,
      fullName: response.attributes.full_name,
      permission: response.attributes.permission_group as ModeratorPermission,
      employment: response.embeds.user.data.attributes.employment || [],
      education: response.embeds.user.data.attributes.education || [],
    };
  }

  static fromUsersWithPaginationGetResponse(
    response: JsonApiResponseWithPaging<UserGetResponse[], null>
  ): PaginatedData<ModeratorAddModel[]> {
    return {
      data: response.data.map(
        (user) =>
          ({
            id: user.id,
            fullName: user.attributes.full_name,
            permission: ModeratorPermission.Moderator,
          }) as ModeratorAddModel
      ),
      totalCount: response.links.meta.total,
    };
  }
}
