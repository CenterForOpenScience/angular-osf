import { Injectable } from '@angular/core';

import { ActivityLog } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogUrlBuilderService {
  buildAHrefElement(url: string | undefined, value: string): string {
    const safeUrl = url || '';
    const relativeUrl = this.toRelativeUrl(safeUrl);
    return `<a href="${relativeUrl}">${value}</a>`;
  }

  buildUserUrl(log: ActivityLog): string {
    const user = log.embeds?.user;
    const githubUser = log.params.githubUser;

    if (user?.id) {
      return this.buildAHrefElement(`/${user.id}`, user.fullName);
    } else if (user?.fullName) {
      return user.fullName;
    } else if (githubUser) {
      return githubUser;
    }

    return '';
  }

  buildNodeUrl(log: ActivityLog): string {
    if (!log.params.paramsNode) {
      return '';
    }

    return this.buildAHrefElement(`project/${log.params.paramsNode.id}`, log.params.paramsNode.title);
  }

  buildInstitutionUrl(log: ActivityLog): string {
    if (!log.params.institution) {
      return '';
    }

    return this.buildAHrefElement(`/institutions/${log.params.institution.id}`, log.params.institution.name);
  }

  buildTagUrl(log: ActivityLog): string {
    if (!log.params.tag) {
      return '';
    }

    return this.buildAHrefElement(`/search?search=%22${log.params.tag}%22`, log.params.tag);
  }

  buildPreprintUrl(log: ActivityLog, preprintWord: string): string {
    if (!log.params.preprint) {
      return '';
    }

    return this.buildAHrefElement(`preprints/${log.params.preprint}`, preprintWord);
  }

  buildPreprintProviderUrl(log: ActivityLog): string {
    if (!log.params.preprintProvider) {
      return '';
    }

    if (typeof log.params.preprintProvider === 'string') {
      return log.params.preprintProvider;
    }

    return this.buildAHrefElement(
      `preprints/overview/${log.params.preprintProvider.url}`,
      log.params.preprintProvider.name
    );
  }

  buildTitleUrl(log: ActivityLog, title: string | undefined): string {
    const originalNode = log.embeds?.originalNode;
    if (originalNode?.id && title) {
      return this.buildAHrefElement(`/${originalNode.id}`, title);
    }
    return '';
  }

  buildEmbeddedUrl(log: ActivityLog): string {
    const linkedNode = log.embeds?.linkedNode;
    const originalNode = log.embeds?.originalNode;

    if (linkedNode?.id) {
      return this.buildAHrefElement(`project/${linkedNode.id}`, linkedNode.title);
    } else if (originalNode?.id) {
      return this.buildAHrefElement(`project/${originalNode.id}`, originalNode.title);
    }
    return '';
  }

  buildFileUrl(log: ActivityLog, path: string): string {
    const acceptableLinkedItems = [
      'osf_storage_file_added',
      'osf_storage_file_updated',
      'file_tag_added',
      'file_tag_removed',
      'github_file_added',
      'github_file_updated',
      'box_file_added',
      'box_file_updated',
      'dropbox_file_added',
      'dropbox_file_updated',
      's3_file_added',
      's3_file_updated',
      'figshare_file_added',
      'checked_in',
      'checked_out',
      'file_metadata_updated',
    ];

    if (acceptableLinkedItems.includes(log.action) && log.params.urls?.view) {
      return this.buildAHrefElement(log.params.urls.view, path);
    }

    return path;
  }

  buildPageUrl(log: ActivityLog, page: string): string {
    const acceptableLinkedItems = ['wiki_updated', 'wiki_renamed'];
    const projectId = log.embeds?.originalNode?.id;
    if (acceptableLinkedItems.includes(log.action) && log.params.pageId && projectId) {
      return this.buildAHrefElement(`project/${projectId}/wiki/?wiki=${log.params.pageId}`, page);
    }

    return page;
  }

  private toRelativeUrl(url: string): string {
    if (!url) return '';

    try {
      const parser = document.createElement('a');
      parser.href = url;

      if (window.location.hostname === parser.hostname) {
        return parser.pathname + parser.search + parser.hash;
      }
      return url;
    } catch {
      return url;
    }
  }
}
