export class HeaderStyleService {
  static applyHeaderStyles(textColor: string) {
    const root = document.documentElement;

    root.style.setProperty('--header-color', textColor);
  }

  static resetToDefaults() {
    const root = document.documentElement;

    root.style.setProperty('--header-color', '');
  }
}
