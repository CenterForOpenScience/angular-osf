import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

import { DEFAULT_TABLE_PARAMS } from '../constants/default-table-params.constants';
import { ActivityLogModel, LogContributorModel } from '../models/activity-logs/activity-logs.model';
import {
  ActivityLogDataJsonApi,
  ActivityLogsResponseJsonApi,
  LogContributorJsonApi,
} from '../models/activity-logs/activity-logs-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';

import { BaseNodeMapper } from './nodes';
import { UserMapper } from './user';

export class ActivityLogsMapper {
  static fromActivityLogJsonApi(log: ActivityLogDataJsonApi, isAnonymous?: boolean): ActivityLogModel {
    const params = log.attributes.params ?? {};
    const contributors = params.contributors ?? [];

    return {
      id: log.id,
      type: log.type,
      action: log.attributes.action,
      date: log.attributes.date,
      foreignUser: log.attributes.foreign_user,
      params: {
        addon: params.addon,
        anonymousLink: params.anonymous_link,
        contributors: contributors.length
          ? contributors.map((contributor) => this.fromContributorJsonApi(contributor))
          : [],
        destination: params.destination,
        file: params.file,
        githubUser: params.github_user,
        identifiers: params.identifiers,
        institution: params.institution,
        kind: params.kind,
        license: params.license,
        oldPage: params.old_page,
        page: params.page,
        pageId: params.page_id,
        paramsNode: params.params_node
          ? {
              id: params.params_node.id,
              title: replaceBadEncodedChars(params.params_node.title),
            }
          : { id: '', title: '' },
        paramsProject: params.params_project,
        pointer: params.pointer
          ? {
              category: params.pointer.category,
              id: params.pointer.id,
              title: replaceBadEncodedChars(params.pointer.title),
              url: params.pointer.url,
            }
          : null,
        preprint: params.preprint,
        preprintProvider: params.preprint_provider,
        source: params.source,
        tag: params.tag,
        templateNode: params.template_node
          ? {
              id: params.template_node.id,
              url: params.template_node.url,
              title: replaceBadEncodedChars(params.template_node.title),
            }
          : null,
        titleNew: params.title_new,
        titleOriginal: params.title_original,
        updatedFields: params.updated_fields,
        urls: params.urls,
        value: params.value,
        version: params.version,
        wiki: params.wiki,
      },
      isAnonymous,
      embeds: log.embeds
        ? {
            originalNode: log.embeds.original_node?.data
              ? BaseNodeMapper.getNodeData(log.embeds.original_node.data)
              : undefined,
            user: log.embeds.user?.data ? UserMapper.fromUserGetResponse(log.embeds.user.data) : undefined,
            linkedNode: log.embeds.linked_node?.data
              ? BaseNodeMapper.getNodeData(log.embeds.linked_node.data)
              : undefined,
          }
        : undefined,
    };
  }

  static fromGetActivityLogsResponse(logs: ActivityLogsResponseJsonApi): PaginatedData<ActivityLogModel[]> {
    const isAnonymous = logs.meta.anonymous ?? false;
    return {
      data: logs.data.map((log) => this.fromActivityLogJsonApi(log, isAnonymous)),
      totalCount: logs.meta.total ?? 0,
      pageSize: logs.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
      isAnonymous,
    };
  }

  private static fromContributorJsonApi(contributor: LogContributorJsonApi): LogContributorModel {
    return {
      id: contributor.id,
      fullName: contributor.full_name,
      givenName: contributor.given_name,
      middleNames: contributor.middle_names,
      familyName: contributor.family_name,
      unregisteredName: contributor.unregistered_name,
      active: contributor.active,
    };
  }
}
