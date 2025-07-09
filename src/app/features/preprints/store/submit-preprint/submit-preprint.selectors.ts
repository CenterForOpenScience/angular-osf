import { Selector } from '@ngxs/store';

import { SubmitPreprintState, SubmitPreprintStateModel } from '@osf/features/preprints/store/submit-preprint';

export class SubmitPreprintSelectors {
  @Selector([SubmitPreprintState])
  static getSelectedProviderId(state: SubmitPreprintStateModel) {
    return state.selectedProviderId;
  }

  @Selector([SubmitPreprintState])
  static getCreatedPreprint(state: SubmitPreprintStateModel) {
    return state.createdPreprint.data;
  }

  @Selector([SubmitPreprintState])
  static isPreprintSubmitting(state: SubmitPreprintStateModel) {
    return state.createdPreprint.isSubmitting;
  }

  @Selector([SubmitPreprintState])
  static getSelectedFileSource(state: SubmitPreprintStateModel) {
    return state.fileSource;
  }

  @Selector([SubmitPreprintState])
  static getUploadLink(state: SubmitPreprintStateModel) {
    return state.preprintFilesLinks.data?.uploadFileLink;
  }

  @Selector([SubmitPreprintState])
  static getPreprintFiles(state: SubmitPreprintStateModel) {
    return state.preprintFiles.data;
  }

  @Selector([SubmitPreprintState])
  static arePreprintFilesLoading(state: SubmitPreprintStateModel) {
    return state.preprintFiles.isLoading;
  }

  @Selector([SubmitPreprintState])
  static getAvailableProjects(state: SubmitPreprintStateModel) {
    return state.availableProjects.data;
  }

  @Selector([SubmitPreprintState])
  static areAvailableProjectsLoading(state: SubmitPreprintStateModel) {
    return state.availableProjects.isLoading;
  }

  @Selector([SubmitPreprintState])
  static getProjectFiles(state: SubmitPreprintStateModel) {
    return state.projectFiles.data;
  }

  @Selector([SubmitPreprintState])
  static areProjectFilesLoading(state: SubmitPreprintStateModel) {
    return state.projectFiles.isLoading;
  }

  @Selector([SubmitPreprintState])
  static getLicenses(state: SubmitPreprintStateModel) {
    return state.licenses.data;
  }

  @Selector([SubmitPreprintState])
  static getPreprintLicense(state: SubmitPreprintStateModel) {
    return state.licenses.data.find((l) => l.id === state.createdPreprint.data?.licenseId) || null;
  }

  @Selector([SubmitPreprintState])
  static getPreprintProject(state: SubmitPreprintStateModel) {
    return state.preprintProject.data;
  }

  @Selector([SubmitPreprintState])
  static isPreprintProjectLoading(state: SubmitPreprintStateModel) {
    return state.preprintProject.isLoading;
  }

  @Selector([SubmitPreprintState])
  static hasBeenSubmitted(state: SubmitPreprintStateModel) {
    return state.hasBeenSubmitted;
  }
}
