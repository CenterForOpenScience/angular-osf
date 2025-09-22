/**
 * Represents a scheduled banner to be displayed on the site.
 *
 * Banners are time-based promotional or informational elements that can be
 * rendered conditionally depending on screen size (mobile vs desktop) and timing.
 */
export interface BannerModel {
  /**
   * Unique identifier for the banner.
   */
  id: string;

  /**
   * The start date and time when the banner should become visible.
   */
  startDate: Date;

  /**
   * The end date and time when the banner should no longer be visible.
   */
  endDate: Date;

  /**
   * The background color of the banner (in CSS color format).
   */
  color: string;

  /**
   * The license type or terms associated with the banner image/media.
   */
  license: string;

  /**
   * The internal or display name for the banner.
   */
  name: string;

  /**
   * Alt text for the banner image on desktop or default view.
   * Used for accessibility and screen readers.
   */
  defaultAltText: string;

  /**
   * Alt text for the banner image on mobile view.
   * Helps with accessibility and improves mobile UX.
   */
  mobileAltText: string;

  /**
   * URL path to the default (desktop) banner image.
   */
  defaultPhoto: string;

  /**
   * URL path to the mobile-optimized banner image.
   */
  mobilePhoto: string;

  /**
   * The external link to open when the banner is clicked.
   * Typically opens in a new tab (`target="_blank"`).
   */
  link: string;
}
