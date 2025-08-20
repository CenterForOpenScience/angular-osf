import { TranslateService } from '@ngx-translate/core';

import { inject, Injectable } from '@angular/core';

import { ActivityLog } from '@shared/models';

import { ActivityLogUrlBuilderService } from './activity-log-url-builder.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogFormatterService {
  private readonly translateService = inject(TranslateService);
  private readonly urlBuilder = inject(ActivityLogUrlBuilderService);

  private readonly nodeCategories = [
    'analysis',
    'communication',
    'data',
    'hypothesis',
    'instrumentation',
    'methods and measures',
    'procedure',
    'project',
    'software',
    'other',
  ];

  buildAnonymous(log: ActivityLog): string {
    return log.params.anonymousLink
      ? this.translateService.instant('activityLog.defaults.anonymousAn')
      : this.translateService.instant('activityLog.defaults.anonymousA');
  }

  buildCommentLocation(log: ActivityLog): string {
    const file = log.params.file;
    const wiki = log.params.wiki;

    if (file) {
      return this.translateService.instant('activityLog.defaults.fileOn', {
        file: this.urlBuilder.buildAHrefElement(`/${file.url}`, file.name),
      });
    }

    if (wiki) {
      return this.translateService.instant('activityLog.defaults.wikiOn', {
        wiki: this.urlBuilder.buildAHrefElement(`/${wiki.url}`, wiki.name),
      });
    }

    return '';
  }

  buildContributorsList(log: ActivityLog): string {
    if (!log.params.contributors || log.params.contributors.length === 0) {
      return this.translateService.instant('activityLog.defaults.someUsers');
    }

    const contributors = log.params.contributors;
    const maxShown = 3;
    const contribList: string[] = [];
    const isJustOneMore = contributors.length === maxShown + 1;

    for (let i = 0; i < contributors.length; i++) {
      const contributor = contributors[i];
      let separator = '';

      if (i < contributors.length - 1) {
        separator =
          i === maxShown - 1 && !isJustOneMore
            ? this.translateService.instant('activityLog.defaults.contributorsAnd')
            : ', ';
      }

      if (i === maxShown && !isJustOneMore) {
        const remainingCount = contributors.length - i;
        const othersText = this.translateService.instant('activityLog.defaults.contributorsOthers');
        contribList.push(`${remainingCount}${othersText}`);
        break;
      }

      const displayName = contributor.active
        ? `<a href="/${contributor.id}/">${contributor.fullName}</a>`
        : contributor.unregisteredName || contributor.fullName;

      contribList.push(`${displayName}${separator}`);
    }

    return contribList.join(' ');
  }

  buildDestination(log: ActivityLog): string {
    if (!log.params.destination) {
      return this.translateService.instant('activityLog.defaults.aNewNameLocation');
    }

    const destination = log.params.destination;
    let materialized = destination.materialized;

    if (materialized.endsWith('/')) {
      materialized = this.replaceSlash(destination.materialized);
      return this.translateService.instant('activityLog.defaults.materialized', {
        materialized,
        addon: destination.addon,
      });
    } else {
      return this.translateService.instant('activityLog.defaults.materialized', {
        materialized: this.urlBuilder.buildAHrefElement(destination.url, materialized),
        addon: destination.addon,
      });
    }
  }

  buildIdentifiers(log: ActivityLog): string {
    if (!log.params.identifiers) {
      return '';
    }

    const doi = log.params.identifiers.doi;
    const ark = log.params.identifiers.ark;

    if (doi && ark) {
      return `doi:${doi} and ark:${ark}`;
    } else if (doi) {
      return `doi:${doi}`;
    } else if (ark) {
      return `ark:${ark}`;
    }

    return '';
  }

  buildOldPage(log: ActivityLog): string {
    return log.params.oldPage ? log.params.oldPage : this.translateService.instant('activityLog.defaults.pageTitle');
  }

  buildPage(log: ActivityLog): string {
    if (!log.params.page) {
      return this.translateService.instant('activityLog.defaults.pageTitle');
    }

    return this.urlBuilder.buildPageUrl(log, log.params.page);
  }

  buildPath(log: ActivityLog): string {
    if (!log.params.path) {
      return this.translateService.instant('activityLog.defaults.aFile');
    }

    const path = this.replaceSlash(log.params.path);
    return this.urlBuilder.buildFileUrl(log, path);
  }

  buildPathType(log: ActivityLog): string {
    if (!log.params.path) {
      return '';
    }

    return log.params.path[0] === '/'
      ? this.translateService.instant('activityLog.defaults.folder')
      : this.translateService.instant('activityLog.defaults.file');
  }

  buildSource(log: ActivityLog): string {
    if (!log.params.source) {
      return this.translateService.instant('activityLog.defaults.aNameLocation');
    }

    const source = log.params.source;
    const materialized = this.replaceSlash(source.materialized);

    return this.translateService.instant('activityLog.defaults.materialized', {
      materialized,
      addon: source.addon,
    });
  }

  buildTitleNew(log: ActivityLog): string {
    const url = this.urlBuilder.buildTitleUrl(log, log.params.titleNew);
    return url || this.translateService.instant('activityLog.defaults.aTitle');
  }

  buildTitleOriginal(log: ActivityLog): string {
    const url = this.urlBuilder.buildTitleUrl(log, log.params.titleOriginal);
    return url || this.translateService.instant('activityLog.defaults.aTitle');
  }

  buildUpdatedFields(log: ActivityLog): string {
    if (!log.params.updatedFields) {
      return this.translateService.instant('activityLog.defaults.field');
    }

    const updatedFieldsParam = log.params.updatedFields;
    const updatedField = Object.keys(updatedFieldsParam)[0];

    if (updatedField === 'category') {
      const newValue = updatedFieldsParam[updatedField].new;
      const newText = this.nodeCategories.includes(newValue)
        ? this.translateService.instant(`nodeCategories.${newValue}`)
        : this.translateService.instant('activityLog.defaults.uncategorized');

      return this.translateService.instant('activityLog.defaults.updatedFields', {
        old: updatedField,
        new: newText,
      });
    }

    return this.translateService.instant('activityLog.defaults.updatedFields', {
      old: updatedField,
      new: updatedFieldsParam[updatedField].new,
    });
  }

  buildVersion(log: ActivityLog): string {
    return log.params.version || '#';
  }

  getPointerCategory(log: ActivityLog): string {
    const linkedNode = log.embeds?.linkedNode;
    return linkedNode?.category || '';
  }

  buildUser(log: ActivityLog): string {
    const userUrl = this.urlBuilder.buildUserUrl(log);
    return userUrl || this.translateService.instant('activityLog.defaults.aUser');
  }

  buildNode(log: ActivityLog): string {
    return this.urlBuilder.buildNodeUrl(log);
  }

  buildEmbeddedNode(log: ActivityLog): string {
    const url = this.urlBuilder.buildEmbeddedUrl(log);
    return url || this.translateService.instant('activityLog.defaults.aTitle');
  }

  buildInstitution(log: ActivityLog): string {
    return this.urlBuilder.buildInstitutionUrl(log);
  }

  buildTag(log: ActivityLog): string {
    return this.urlBuilder.buildTagUrl(log);
  }

  buildPreprint(log: ActivityLog): string {
    const preprintWord = this.translateService.instant('activityLog.defaults.preprint');
    return this.urlBuilder.buildPreprintUrl(log, preprintWord);
  }

  buildPreprintProvider(log: ActivityLog): string {
    return this.urlBuilder.buildPreprintProviderUrl(log);
  }

  buildFallbackMessage(log: ActivityLog): string {
    const user = this.buildUser(log);
    const node = this.buildNode(log);
    const action = log.action.replace(/_/g, ' ');

    if (node) {
      return this.translateService.instant('activityLog.defaults.fallbackWithNode', {
        user,
        action,
        node,
      });
    }
    return this.translateService.instant('activityLog.defaults.fallbackWithoutNode', {
      user,
      action,
    });
  }

  private replaceSlash(path: string): string {
    return path.replace(/^\/|\/$/g, '');
  }
}
