export interface LicenseModel {
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

export interface LicenseDetails {
  id: string;
  licenseOptions: LicenseOptions;
}

export interface LicensesOption {
  copyrightHolders: string[] | null;
  year: string | null;
}
