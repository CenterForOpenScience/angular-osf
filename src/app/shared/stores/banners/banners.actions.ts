/**
 * NGXS Action: GetCurrentScheduledBanner
 *
 * Triggers a get for the current scheduled banner from the backend.
 * Intended to update the `currentBanner` portion of the `BannersState`
 * with loading, success, or error state based on the async request.
 *
 * Typically dispatched on application startup or when a banner update is needed.
 */
export class GetCurrentScheduledBanner {
  /** The NGXS action type identifier. */
  static readonly type = '[Banners] Get Current Scheduled Banner';
}
