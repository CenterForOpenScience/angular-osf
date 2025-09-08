import { GoogleFileDataModel } from './google-file.data.model';

/**
 * Represents the data returned by the Google File Picker integration.
 */
export interface GoogleFilePickerModel {
  /**
   * The type of action performed by the user in the file picker.
   * For example: 'picked', 'cancelled'.
   */
  action: string;

  /**
   * The list of documents selected by the user.
   * Each document is represented as a GoogleFileDataModel.
   */
  docs: GoogleFileDataModel[];
}
