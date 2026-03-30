import { TranslateService } from '@ngx-translate/core';

import { formatDate } from '@angular/common';
import { inject, Injectable, LOCALE_ID } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { OsfFileCustomMetadata } from '@osf/features/files/models';
import { PreprintModel } from '@osf/features/preprints/models';
import { ProjectOverviewModel } from '@osf/features/project/overview/models';
import { RegistrationOverviewModel } from '@osf/features/registry/models';

import { pathJoin } from '../helpers/path-join.helper';
import { ContributorModel } from '../models/contributors/contributor.model';
import { FileDetailsModel } from '../models/files/file.model';
import { MetaTagsData } from '../models/meta-tags/meta-tags-data.model';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsBuilderService {
  private readonly environment = inject(ENVIRONMENT);
  private readonly locale = inject(LOCALE_ID);
  private readonly translateService = inject(TranslateService);

  private readonly dateFormat = 'yyyy-MM-dd';

  buildProjectMetaTagsData(params: {
    project: ProjectOverviewModel;
    canonicalPath: string;
    contributors: ContributorModel[];
    licenseName?: string;
  }): MetaTagsData {
    const { project, canonicalPath, contributors, licenseName } = params;
    const keywords = [...(project.tags || []), ...(project.category ? [project.category] : [])];

    return {
      osfGuid: project.id,
      title: project.title,
      description: project.description,
      url: pathJoin(this.environment.webUrl, project.id, 'overview'),
      canonicalUrl: pathJoin(this.environment.webUrl, project.id, canonicalPath),
      license: licenseName,
      publishedDate: this.formatDate(project.dateCreated),
      modifiedDate: this.formatDate(project.dateModified),
      keywords,
      contributors: contributors.map((contributor) => ({
        fullName: contributor.fullName,
        givenName: contributor.givenName,
        familyName: contributor.familyName,
      })),
    };
  }

  buildRegistryMetaTagsData(params: {
    registry: RegistrationOverviewModel;
    canonicalPath: string;
    contributors: ContributorModel[];
    licenseName?: string;
  }): MetaTagsData {
    const { registry, canonicalPath, contributors, licenseName } = params;

    return {
      osfGuid: registry.id,
      title: registry.title,
      description: registry.description,
      publishedDate: this.formatDate(registry.dateRegistered),
      modifiedDate: this.formatDate(registry.dateModified),
      url: pathJoin(this.environment.webUrl, registry.id),
      canonicalUrl: pathJoin(this.environment.webUrl, registry.id, canonicalPath),
      identifier: registry.id,
      doi: registry.articleDoi,
      keywords: registry.tags,
      siteName: 'OSF',
      license: licenseName,
      contributors: this.mapContributors(contributors),
    };
  }

  buildPreprintMetaTagsData(params: {
    providerId?: string;
    preprint: PreprintModel | null;
    contributors: ContributorModel[];
  }): MetaTagsData {
    const { providerId, preprint, contributors } = params;

    return {
      osfGuid: preprint?.id,
      title: preprint?.title,
      description: preprint?.description,
      publishedDate: this.formatDate(preprint?.datePublished),
      modifiedDate: this.formatDate(preprint?.dateModified),
      url: pathJoin(this.environment.webUrl, preprint?.id ?? ''),
      canonicalUrl: pathJoin(this.environment.webUrl, 'preprints', providerId ?? '', preprint?.id ?? ''),
      doi: preprint?.doi,
      keywords: preprint?.tags,
      siteName: 'OSF',
      license: preprint?.embeddedLicense?.name,
      contributors: this.mapContributors(contributors),
    };
  }

  buildFileMetaTagsData(params: {
    file: FileDetailsModel;
    fileMetadata: OsfFileCustomMetadata | null;
    contributors: ContributorModel[];
  }): MetaTagsData {
    const { file, fileMetadata, contributors } = params;

    const targetId = file.target?.id;
    const fileGuid = file.guid ?? '';

    return {
      osfGuid: file.guid,
      title: fileMetadata?.title || file.name,
      type: fileMetadata?.resourceTypeGeneral,
      description: fileMetadata?.description ?? this.translateService.instant('files.metaTagDescriptionPlaceholder'),
      url: pathJoin(this.environment.webUrl, fileGuid),
      canonicalUrl: targetId
        ? pathJoin(this.environment.webUrl, targetId, 'files', fileGuid)
        : pathJoin(this.environment.webUrl, fileGuid),
      publishedDate: this.formatDate(file.dateCreated),
      modifiedDate: this.formatDate(file.dateModified),
      language: fileMetadata?.language,
      contributors: this.mapContributors(contributors),
    };
  }

  private mapContributors(contributors: ContributorModel[]) {
    return contributors.map(({ fullName, givenName, familyName }) => ({ fullName, givenName, familyName }));
  }

  private formatDate(value?: string | Date | null) {
    if (!value) {
      return null;
    }

    return formatDate(value, this.dateFormat, this.locale);
  }
}
