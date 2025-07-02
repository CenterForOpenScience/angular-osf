export interface License {
  id: string;
  name: string;
  requiredFields: string[];
  url: string;
  text: string;
}

export interface LicenseOptions {
  copyrightHolders: string;
  year: string;
}
