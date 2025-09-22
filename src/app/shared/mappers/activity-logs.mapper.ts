import {
  ActivityLog,
  ActivityLogJsonApi,
  JsonApiResponseWithMeta,
  LogContributor,
  LogContributorJsonApi,
  MetaAnonymousJsonApi,
  PaginatedData,
} from '../models';

export class ActivityLogsMapper {
  static fromActivityLogJsonApi(log: ActivityLogJsonApi, isAnonymous?: boolean): ActivityLog {
    const params = log.attributes.params ?? {};
    const contributors = params.contributors ?? [];

    return {
      id: log.id,
      type: log.type,
      action: log.attributes.action,
      date: log.attributes.date,
      params: {
        contributors: contributors.length
          ? contributors.map((contributor) => this.fromContributorJsonApi(contributor))
          : [],
        license: params.license,
        tag: params.tag,
        institution: params.institution,
        paramsNode: params.params_node
          ? {
              id: params.params_node.id,
              title: params.params_node.title,
            }
          : { id: '', title: '' },
        paramsProject: params.params_project,
        template_node: params.template_node
          ? {
              id: params.template_node.id,
              url: params.template_node.url,
              title: params.template_node.title,
            }
          : null,
        pointer: params.pointer
          ? {
              category: params.pointer.category,
              id: params.pointer.id,
              title: params.pointer.title,
              url: params.pointer.url,
            }
          : null,
        preprintProvider: params.preprint_provider,
        addon: params.addon,
        anonymousLink: params.anonymous_link,
        file: params.file,
        wiki: params.wiki,
        destination: params.destination,
        identifiers: params.identifiers,
        kind: params.kind,
        oldPage: params.old_page,
        page: params.page,
        pageId: params.page_id,
        path: params.path,
        urls: params.urls,
        preprint: params.preprint,
        source: params.source,
        titleNew: params.title_new,
        titleOriginal: params.title_original,
        updatedFields: params.updated_fields,
        value: params.value,
        version: params.version,
        githubUser: params.github_user,
      },
      isAnonymous,
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

  static fromGetActivityLogsResponse(
    logs: JsonApiResponseWithMeta<ActivityLogJsonApi[], MetaAnonymousJsonApi, null>
  ): PaginatedData<ActivityLog[]> {
    const isAnonymous = logs.meta.anonymous ?? false;
    return {
      data: logs.data.map((log) => this.fromActivityLogJsonApi(log, isAnonymous)),
      totalCount: logs.meta.total ?? 0,
      isAnonymous,
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
