export class BrowserTabHelper {
  private static readonly DEFAULT_FAVICON = '/favicon.ico';
  private static readonly DEFAULT_TITLE = 'OSF';

  static updateTabStyles(faviconUrl: string, title: string) {
    if (faviconUrl) {
      const faviconElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      faviconElement.href = faviconUrl;
    }

    if (title) {
      document.title = title;
    }
  }

  static resetToDefaults() {
    const faviconElement = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    faviconElement.href = this.DEFAULT_FAVICON;

    document.title = this.DEFAULT_TITLE;
  }
}
