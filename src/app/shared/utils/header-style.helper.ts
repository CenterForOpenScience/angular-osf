export class HeaderStyleHelper {
  static applyHeaderStyles(textColor: string, backgroundColor?: string, backgroundImageUrl?: string) {
    const root = document.documentElement;

    root.style.setProperty('--header-color', textColor);
    root.style.setProperty('--header-background-color', backgroundColor || '');
    root.style.setProperty('--header-background-image-url', backgroundImageUrl || '');
  }

  static resetToDefaults() {
    const root = document.documentElement;

    root.style.setProperty('--header-color', '');
    root.style.setProperty('--header-background-color', '');
    root.style.setProperty('--header-background-image-url', '');
  }
}
