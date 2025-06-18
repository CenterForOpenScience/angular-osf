import { Selector } from '@ngxs/store';

import { Wiki, WikiVersion } from '../models';

import { ComponentWiki, WikiModesStateModel, WikiStateModel } from './wiki.model';
import { WikiState } from './wiki.state';

export class WikiSelectors {
  @Selector([WikiState])
  static getHomeWikiContent(state: WikiStateModel): string {
    return state.homeWikiContent.data;
  }

  @Selector([WikiState])
  static getHomeWikiLoading(state: WikiStateModel): boolean {
    return state.homeWikiContent.isLoading;
  }

  @Selector([WikiState])
  static getWikiModes(state: WikiStateModel): WikiModesStateModel {
    return state.wikiModes;
  }

  @Selector([WikiState])
  static getWikiList(state: WikiStateModel): Wiki[] {
    return state.projectWikiList.data;
  }

  @Selector([WikiState])
  static getWikiListLoading(state: WikiStateModel): boolean {
    return state.projectWikiList.isLoading;
  }

  @Selector([WikiState])
  static getComponentsWikiList(state: WikiStateModel): ComponentWiki[] {
    return state.projectComponentsWikiList.data;
  }

  @Selector([WikiState])
  static getComponentsWikiListLoading(state: WikiStateModel): boolean {
    return state.projectComponentsWikiList.isLoading;
  }

  @Selector([WikiState])
  static getWikiSubmitting(state: WikiStateModel): boolean {
    return state.projectWikiList.isSubmitting ?? false;
  }

  @Selector([WikiState])
  static getCurrentWikiId(state: WikiStateModel): string {
    return state.currentWikiId;
  }

  @Selector([WikiState])
  static getWikiVersions(state: WikiStateModel): WikiVersion[] {
    return state.wikiVersions.data;
  }

  @Selector([WikiState])
  static getWikiVersionsLoading(state: WikiStateModel): boolean {
    return state.wikiVersions.isLoading;
  }

  @Selector([WikiState])
  static getCompareVersionsLoading(state: WikiStateModel): boolean {
    return state.compareVersionContent.isLoading;
  }

  @Selector([WikiState])
  static getWikiVersionContent(state: WikiStateModel): string {
    return state.versionContent.data;
  }

  @Selector([WikiState])
  static getCompareVersionContent(state: WikiStateModel): string {
    return state.compareVersionContent.data;
  }

  @Selector([WikiState])
  static getWikiVersionSubmitting(state: WikiStateModel): boolean {
    return state.versionContent.isSubmitting ?? false;
  }

  @Selector([WikiState])
  static getPreviewContent(state: WikiStateModel): string {
    return state.previewContent;
  }
}
