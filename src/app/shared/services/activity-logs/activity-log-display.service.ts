import { TranslateService } from '@ngx-translate/core';

import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ActivityLog } from '@shared/models';

import { ActivityLogFormatterService } from './activity-log-formatter.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogDisplayService {
  private readonly translateService = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly formatter = inject(ActivityLogFormatterService);

  getActivityDisplay(log: ActivityLog): SafeHtml {
    const translationKey = `activityLog.activities.${log.action}`;
    const translationParams = this.buildTranslationParams(log);

    const translation = this.translateService.instant(translationKey, translationParams);
    const finalTranslation = translation === translationKey ? this.formatter.buildFallbackMessage(log) : translation;

    const htmlContent = `<span>${finalTranslation}</span>`;
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  private buildTranslationParams(log: ActivityLog): Record<string, unknown> {
    return {
      addon: log.params.addon || '',
      anonymousLink: this.formatter.buildAnonymous(log),
      commentLocation: this.formatter.buildCommentLocation(log),
      contributors: this.formatter.buildContributorsList(log),
      destination: this.formatter.buildDestination(log),
      forkedFrom: this.formatter.buildNode(log),
      identifiers: this.formatter.buildIdentifiers(log),
      institution: this.formatter.buildInstitution(log),
      kind: log.params.kind,
      license: log.params.license || '',
      node: this.formatter.buildNode(log),
      oldPage: this.formatter.buildOldPage(log),
      page: this.formatter.buildPage(log),
      path: this.formatter.buildPath(log),
      pathType: this.formatter.buildPathType(log),
      pointer: this.formatter.buildEmbeddedNode(log),
      pointerCategory: this.formatter.getPointerCategory(log),
      preprint: this.formatter.buildPreprint(log),
      preprintProvider: this.formatter.buildPreprintProvider(log),
      preprintWord: this.translateService.instant('activityLog.defaults.preprint'),
      preprintWordPlural: this.translateService.instant('activityLog.defaults.preprintPlural'),
      source: this.formatter.buildSource(log),
      tag: this.formatter.buildTag(log),
      template: this.formatter.buildEmbeddedNode(log),
      titleNew: this.formatter.buildTitleNew(log),
      titleOriginal: this.formatter.buildTitleOriginal(log),
      updatedFields: this.formatter.buildUpdatedFields(log),
      user: this.formatter.buildUser(log),
      value: log.params.value,
      version: this.formatter.buildVersion(log),
    };
  }
}
