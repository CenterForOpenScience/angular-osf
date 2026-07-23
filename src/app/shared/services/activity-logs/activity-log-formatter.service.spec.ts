import { TranslateService } from '@ngx-translate/core';

import { TestBed } from '@angular/core/testing';

import { makeActivityLog } from '@testing/mocks/activity-log.mock';
import { testNode } from '@testing/mocks/base-node.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { ActivityLogFormatterService } from './activity-log-formatter.service';
import { ActivityLogUrlBuilderService } from './activity-log-url-builder.service';

describe('ActivityLogFormatterService', () => {
  let service: ActivityLogFormatterService;
  let translateService: TranslateService;
  let urlBuilder: ActivityLogUrlBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityLogFormatterService, ActivityLogUrlBuilderService, provideOSFCore()],
    });

    service = TestBed.inject(ActivityLogFormatterService);
    translateService = TestBed.inject(TranslateService);
    urlBuilder = TestBed.inject(ActivityLogUrlBuilderService);
  });

  it('buildAnonymous returns anonymousAn when anonymous link is set', () => {
    const log = makeActivityLog({ params: { anonymousLink: true } });

    expect(service.buildAnonymous(log)).toBe('activityLog.defaults.anonymousAn');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.anonymousAn');
  });

  it('buildAnonymous returns anonymousA when anonymous link is not set', () => {
    const log = makeActivityLog();

    expect(service.buildAnonymous(log)).toBe('activityLog.defaults.anonymousA');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.anonymousA');
  });

  it('buildUser returns user url when embedded user is available', () => {
    const log = makeActivityLog({
      embeds: {
        user: {
          ...MOCK_USER,
          id: 'user-1',
          fullName: 'Jane Doe',
        },
      },
    });

    expect(service.buildUser(log)).toBe('<a href="/user-1">Jane Doe</a>');
  });

  it('buildUser capitalizes foreignUser when no user url is available', () => {
    const log = makeActivityLog({ foreignUser: 'githubUser' });

    expect(service.buildUser(log)).toBe('GithubUser');
  });

  it('buildUser returns default translation when user and foreignUser are missing', () => {
    const log = makeActivityLog();

    expect(service.buildUser(log)).toBe('activityLog.defaults.aUser');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.aUser');
  });

  it('buildCommentLocation returns file translation when file param exists', () => {
    const buildAHrefElementSpy = vi.spyOn(urlBuilder, 'buildAHrefElement');
    const log = makeActivityLog({
      params: {
        file: { name: 'data.csv', url: 'files/data.csv' },
      },
    });

    expect(service.buildCommentLocation(log)).toBe('activityLog.defaults.fileOn');
    expect(buildAHrefElementSpy).toHaveBeenCalledWith('/files/data.csv', 'data.csv');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.fileOn', {
      file: '<a href="/files/data.csv">data.csv</a>',
    });
  });

  it('buildCommentLocation returns wiki translation when wiki param exists', () => {
    const log = makeActivityLog({
      params: {
        wiki: { name: 'Home', url: 'wiki/home' },
      },
    });

    expect(service.buildCommentLocation(log)).toBe('activityLog.defaults.wikiOn');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.wikiOn', {
      wiki: '<a href="/wiki/home">Home</a>',
    });
  });

  it('buildCommentLocation returns empty string when file and wiki are missing', () => {
    expect(service.buildCommentLocation(makeActivityLog())).toBe('');
  });

  it('buildContributorsList returns someUsers when contributors are missing', () => {
    expect(service.buildContributorsList(makeActivityLog())).toBe('activityLog.defaults.someUsers');
  });

  it('buildContributorsList returns linked active contributors and others count', () => {
    const log = makeActivityLog({
      params: {
        contributors: [
          {
            id: 'c-1',
            fullName: 'Alice',
            givenName: 'Alice',
            middleNames: '',
            familyName: '',
            unregisteredName: null,
            active: true,
          },
          {
            id: 'c-2',
            fullName: 'Bob',
            givenName: 'Bob',
            middleNames: '',
            familyName: '',
            unregisteredName: null,
            active: true,
          },
          {
            id: 'c-3',
            fullName: 'Carol',
            givenName: 'Carol',
            middleNames: '',
            familyName: '',
            unregisteredName: null,
            active: true,
          },
          {
            id: 'c-4',
            fullName: 'Dave',
            givenName: 'Dave',
            middleNames: '',
            familyName: '',
            unregisteredName: null,
            active: false,
          },
          {
            id: 'c-5',
            fullName: 'Eve',
            givenName: 'Eve',
            middleNames: '',
            familyName: '',
            unregisteredName: null,
            active: false,
          },
        ],
      },
    });

    expect(service.buildContributorsList(log)).toBe(
      '<a href="/c-1/">Alice</a>,  <a href="/c-2/">Bob</a>,  <a href="/c-3/">Carol</a>activityLog.defaults.contributorsAnd 2activityLog.defaults.contributorsOthers'
    );
  });

  it('buildIdentifiers returns empty string when identifiers are missing', () => {
    expect(service.buildIdentifiers(makeActivityLog())).toBe('');
  });

  it('buildIdentifiers returns doi and ark when both exist', () => {
    const log = makeActivityLog({
      params: {
        identifiers: { doi: '10.1234/example', ark: 'ark:/12345' },
      },
    });

    expect(service.buildIdentifiers(log)).toBe('doi:10.1234/example and ark:ark:/12345');
  });

  it('buildIdentifiers returns only doi when ark is missing', () => {
    const log = makeActivityLog({
      params: {
        identifiers: { doi: '10.1234/example' },
      },
    });

    expect(service.buildIdentifiers(log)).toBe('doi:10.1234/example');
  });

  it('buildPathType returns folder for paths starting with slash', () => {
    const log = makeActivityLog({ params: { path: '/folder' } });

    expect(service.buildPathType(log)).toBe('activityLog.defaults.folder');
  });

  it('buildPathType returns file for non-folder paths', () => {
    const log = makeActivityLog({ params: { path: 'file.txt' } });

    expect(service.buildPathType(log)).toBe('activityLog.defaults.file');
  });

  it('buildPathType returns empty string when path is missing', () => {
    expect(service.buildPathType(makeActivityLog())).toBe('');
  });

  it('buildVersion returns version from params or hash fallback', () => {
    expect(service.buildVersion(makeActivityLog({ params: { version: '3' } }))).toBe('3');
    expect(service.buildVersion(makeActivityLog())).toBe('#');
  });

  it('buildUpdatedFields returns field translation when updated fields are missing', () => {
    expect(service.buildUpdatedFields(makeActivityLog())).toBe('activityLog.defaults.field');
  });

  it('buildUpdatedFields translates known category values', () => {
    const log = makeActivityLog({
      params: {
        updatedFields: {
          category: { old: 'other', new: 'analysis' },
        },
      },
    });

    expect(service.buildUpdatedFields(log)).toBe('activityLog.defaults.updatedFields');
    expect(translateService.instant).toHaveBeenCalledWith('nodeCategories.analysis');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.updatedFields', {
      old: 'category',
      new: 'nodeCategories.analysis',
    });
  });

  it('buildUpdatedFields returns raw new value for non-category fields', () => {
    const log = makeActivityLog({
      params: {
        updatedFields: {
          title: { old: 'Old', new: 'New' },
        },
      },
    });

    expect(service.buildUpdatedFields(log)).toBe('activityLog.defaults.updatedFields');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.updatedFields', {
      old: 'title',
      new: 'New',
    });
  });

  it('getPointerCategory returns linked node category', () => {
    const log = makeActivityLog({
      embeds: {
        linkedNode: {
          ...testNode,
          id: 'node-1',
          title: 'Linked',
          category: 'project',
        },
      },
    });

    expect(service.getPointerCategory(log)).toBe('project');
  });

  it('buildFallbackMessage uses fallbackWithNode when node url exists', () => {
    const log = makeActivityLog({
      action: 'node_updated',
      params: {
        paramsNode: { id: 'node-1', title: 'My Project' },
      },
    });

    expect(service.buildFallbackMessage(log)).toBe('activityLog.defaults.fallbackWithNode');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.fallbackWithNode', {
      user: 'activityLog.defaults.aUser',
      action: 'node updated',
      node: '<a href="/node-1">My Project</a>',
    });
  });

  it('buildFallbackMessage uses fallbackWithoutNode when node is empty', () => {
    const log = makeActivityLog({ action: 'node_updated' });
    vi.spyOn(service, 'buildNode').mockReturnValue('');

    expect(service.buildFallbackMessage(log)).toBe('activityLog.defaults.fallbackWithoutNode');
    expect(translateService.instant).toHaveBeenCalledWith('activityLog.defaults.fallbackWithoutNode', {
      user: 'activityLog.defaults.aUser',
      action: 'node updated',
    });
  });
});
