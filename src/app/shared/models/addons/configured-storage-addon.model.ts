/**
 * Represents a configured external addon instance for a resource (e.g., a linked storage service).
 *
 * This model is used after an addon has been fully authorized and configured for a specific project
 * or user in the OSF system. It includes metadata about the integration, ownership, and operational capabilities.
 */
export interface ConfiguredStorageAddonModel {
  /**
   * The JSON:API resource type (typically "configured-storage-addons").
   */
  type: string;
  /**
   * The unique identifier for the configured addon instance.
   */
  id: string;
  /**
   * The human-readable name of the external service (e.g., "Google Drive").
   */
  displayName: string;
  /**
   * The internal key used to identify the service provider (e.g., "googledrive").
   */
  externalServiceName: string;
  /**
   * The ID of the folder selected as the root for the addon connection.
   */
  selectedFolderId: string;
  /**
   * A list of capabilities supported by this addon (e.g., ADD_UPDATE_FILES, PERMISSIONS).
   */
  connectedCapabilities: string[];
  /**
   * A list of connected operation names available through this addon (e.g., UPLOAD_FILE).
   */
  connectedOperationNames: string[];
  /**
   * Indicates whether the current user is the owner of the configured addon.
   */
  currentUserIsOwner: boolean;
  /**
   * The ID of the base account associated with this addon configuration.
   */
  baseAccountId: string;
  /**
   * The resource type of the base account (e.g., "external-storage-accounts").
   */
  baseAccountType: string;
  /**
   * Optional: If linked to a parent storage service, provides its ID and name.
   */
  externalStorageServiceId?: string;
  /**
   * Optional: The root folder id
   */
  rootFolderId?: string;
}
