/**
 * Represents a simplified file object returned from the Google File Picker.
 *
 * This model is used to extract and store essential metadata for a selected file.
 */
export interface GoogleFileDataModel {
  /**
   * The display name of the selected file.
   */
  name: string;

  /**
   * The unique identifier assigned to the file.
   */
  id: number;
}
