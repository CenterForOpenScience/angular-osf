import { ActivityLog, ActivityLogJsonApi, LogContributor, PaginatedData, ResponseJsonApi } from '@shared/models';
import { LogContributorJsonApi } from '@shared/models/activity-logs/activity-logs-json-api.model';

export class ActivityLogsMapper {
  static fromActivityLogJsonApi(log: ActivityLogJsonApi): ActivityLog {
    return {
      id: log.id,
      type: log.type,
      action: log.attributes.action,
      date: log.attributes.date,
      params: {
        contributors: log.attributes.params.contributors.map((contributor) => this.fromContributorJsonApi(contributor)),
        license: log.attributes.params.license,
        tag: log.attributes.params.tag,
        institution: log.attributes.params.institution,
        paramsNode: {
          id: log.attributes.params.params_node.id,
          title: log.attributes.params.params_node.title,
        },
        paramsProject: log.attributes.params.params_project,
        pointer: log.attributes.params.pointer
          ? {
              category: log.attributes.params.pointer.category,
              id: log.attributes.params.pointer.id,
              title: log.attributes.params.pointer.title,
              url: log.attributes.params.pointer.url,
            }
          : null,
        preprintProvider: log.attributes.params.preprint_provider,
        addon: log.attributes.params.addon,
        anonymousLink: log.attributes.params.anonymous_link,
        file: log.attributes.params.file,
        wiki: log.attributes.params.wiki,
        destination: log.attributes.params.destination,
        identifiers: log.attributes.params.identifiers,
        kind: log.attributes.params.kind,
        oldPage: log.attributes.params.old_page,
        page: log.attributes.params.page,
        pageId: log.attributes.params.page_id,
        path: log.attributes.params.path,
        urls: log.attributes.params.urls,
        preprint: log.attributes.params.preprint,
        source: log.attributes.params.source,
        titleNew: log.attributes.params.title_new,
        titleOriginal: log.attributes.params.title_original,
        updatedFields: log.attributes.params.updated_fields,
        value: log.attributes.params.value,
        version: log.attributes.params.version,
        githubUser: log.attributes.params.github_user,
      },
      embeds: log.embeds
        ? {
            originalNode: log.embeds.original_node?.data
              ? {
                  id: log.embeds.original_node.data.id,
                  type: log.embeds.original_node.data.type,
                  title: log.embeds.original_node.data.attributes.title,
                  description: log.embeds.original_node.data.attributes.description,
                  category: log.embeds.original_node.data.attributes.category,
                  customCitation: log.embeds.original_node.data.attributes.custom_citation,
                  dateCreated: log.embeds.original_node.data.attributes.date_created,
                  dateModified: log.embeds.original_node.data.attributes.date_modified,
                  registration: log.embeds.original_node.data.attributes.registration,
                  preprint: log.embeds.original_node.data.attributes.preprint,
                  fork: log.embeds.original_node.data.attributes.fork,
                  collection: log.embeds.original_node.data.attributes.collection,
                  tags: log.embeds.original_node.data.attributes.tags,
                  accessRequestsEnabled: log.embeds.original_node.data.attributes.access_requests_enabled,
                  nodeLicense: log.embeds.original_node.data.attributes.node_license
                    ? {
                        copyrightHolders: log.embeds.original_node.data.attributes.node_license.copyright_holders,
                        year: log.embeds.original_node.data.attributes.node_license.year,
                      }
                    : { copyrightHolders: [], year: null },
                  currentUserCanComment: log.embeds.original_node.data.attributes.current_user_can_comment,
                  currentUserPermissions: log.embeds.original_node.data.attributes.current_user_permissions,
                  currentUserIsContributor: log.embeds.original_node.data.attributes.current_user_is_contributor,
                  currentUserIsContributorOrGroupMember:
                    log.embeds.original_node.data.attributes.current_user_is_contributor_or_group_member,
                  wikiEnabled: log.embeds.original_node.data.attributes.wiki_enabled,
                  public: log.embeds.original_node.data.attributes.public,
                  subjects: log.embeds.original_node.data.attributes.subjects,
                }
              : undefined,
            user: log.embeds.user?.data
              ? {
                  id: log.embeds.user.data.id,
                  type: log.embeds.user.data.type,
                  fullName: log.embeds.user.data.attributes.full_name,
                  givenName: log.embeds.user.data.attributes.given_name,
                  middleNames: log.embeds.user.data.attributes.middle_names,
                  familyName: log.embeds.user.data.attributes.family_name,
                  suffix: log.embeds.user.data.attributes.suffix,
                  dateRegistered: log.embeds.user.data.attributes.date_registered,
                  active: log.embeds.user.data.attributes.active,
                  timezone: log.embeds.user.data.attributes.timezone,
                  locale: log.embeds.user.data.attributes.locale,
                }
              : undefined,
            linkedNode: log.embeds.linked_node?.data
              ? {
                  id: log.embeds.linked_node.data.id,
                  type: log.embeds.linked_node.data.type,
                  title: log.embeds.linked_node.data.attributes.title,
                  description: log.embeds.linked_node.data.attributes.description,
                  category: log.embeds.linked_node.data.attributes.category,
                  customCitation: log.embeds.linked_node.data.attributes.custom_citation,
                  dateCreated: log.embeds.linked_node.data.attributes.date_created,
                  dateModified: log.embeds.linked_node.data.attributes.date_modified,
                  registration: log.embeds.linked_node.data.attributes.registration,
                  preprint: log.embeds.linked_node.data.attributes.preprint,
                  fork: log.embeds.linked_node.data.attributes.fork,
                  collection: log.embeds.linked_node.data.attributes.collection,
                  tags: log.embeds.linked_node.data.attributes.tags,
                  accessRequestsEnabled: log.embeds.linked_node.data.attributes.access_requests_enabled,
                  nodeLicense: log.embeds.linked_node.data.attributes.node_license
                    ? {
                        copyrightHolders: log.embeds.linked_node.data.attributes.node_license.copyright_holders,
                        year: log.embeds.linked_node.data.attributes.node_license.year,
                      }
                    : { copyrightHolders: [], year: null },
                  currentUserCanComment: log.embeds.linked_node.data.attributes.current_user_can_comment,
                  currentUserPermissions: log.embeds.linked_node.data.attributes.current_user_permissions,
                  currentUserIsContributor: log.embeds.linked_node.data.attributes.current_user_is_contributor,
                  currentUserIsContributorOrGroupMember:
                    log.embeds.linked_node.data.attributes.current_user_is_contributor_or_group_member,
                  wikiEnabled: log.embeds.linked_node.data.attributes.wiki_enabled,
                  public: log.embeds.linked_node.data.attributes.public,
                  subjects: log.embeds.linked_node.data.attributes.subjects,
                }
              : undefined,
          }
        : undefined,
    };
  }

  static fromGetActivityLogsResponse(logs: ResponseJsonApi<ActivityLogJsonApi[]>): PaginatedData<ActivityLog[]> {
    return {
      data: logs.data.map((log) => this.fromActivityLogJsonApi(log)),
      totalCount: logs.meta.total ?? 0,
    };
  }

  private static fromContributorJsonApi(contributor: LogContributorJsonApi): LogContributor {
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
