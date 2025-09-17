import { Selector } from '@ngxs/store';

import { PreprintStepperState, PreprintStepperStateModel } from '@osf/features/preprints/store/preprint-stepper';

export class PreprintStepperSelectors {
  @Selector([PreprintStepperState])
  static getSelectedProviderId(state: PreprintStepperStateModel) {
    return state.selectedProviderId;
  }

  @Selector([PreprintStepperState])
  static getPreprint(state: PreprintStepperStateModel) {
    return state.preprint.data;
  }

  @Selector([PreprintStepperState])
  static isPreprintSubmitting(state: PreprintStepperStateModel) {
    return state.preprint.isSubmitting;
  }

  @Selector([PreprintStepperState])
  static getSelectedFileSource(state: PreprintStepperStateModel) {
    return state.fileSource;
  }

  @Selector([PreprintStepperState])
  static getUploadLink(state: PreprintStepperStateModel) {
    return state.preprintFilesLinks.data?.uploadFileLink;
  }

  @Selector([PreprintStepperState])
  static getPreprintFile(state: PreprintStepperStateModel) {
    return state.preprintFile.data;
  }

  @Selector([PreprintStepperState])
  static isPreprintFilesLoading(state: PreprintStepperStateModel) {
    return state.preprintFile.isLoading;
  }

  @Selector([PreprintStepperState])
  static getAvailableProjects(state: PreprintStepperStateModel) {
    return state.availableProjects.data;
  }

  @Selector([PreprintStepperState])
  static areAvailableProjectsLoading(state: PreprintStepperStateModel) {
    return state.availableProjects.isLoading;
  }

  @Selector([PreprintStepperState])
  static getProjectFiles(state: PreprintStepperStateModel) {
    return state.projectFiles.data;
  }

  @Selector([PreprintStepperState])
  static areProjectFilesLoading(state: PreprintStepperStateModel) {
    return state.projectFiles.isLoading;
  }

  @Selector([PreprintStepperState])
  static getLicenses(state: PreprintStepperStateModel) {
    return state.licenses.data;
  }

  @Selector([PreprintStepperState])
  static getPreprintLicense(state: PreprintStepperStateModel) {
    return state.licenses.data.find((l) => l.id === state.preprint.data?.licenseId) || null;
  }

  @Selector([PreprintStepperState])
  static getPreprintProject(state: PreprintStepperStateModel) {
    return state.preprintProject.data;
  }

  @Selector([PreprintStepperState])
  static isPreprintProjectLoading(state: PreprintStepperStateModel) {
    return state.preprintProject.isLoading;
  }

  @Selector([PreprintStepperState])
  static hasBeenSubmitted(state: PreprintStepperStateModel) {
    return state.hasBeenSubmitted;
  }

  @Selector([PreprintStepperState])
  static getCurrentFolder(state: PreprintStepperStateModel) {
    return state.currentFolder;
  }
}
