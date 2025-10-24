export enum AddonType {
  STORAGE = 'storage',
  CITATION = 'citation',
  LINK = 'link',
  REDIRECT = 'redirect', // Redirect addons will not have authorized accounts or configured addons
}

export enum AuthorizedAccountType {
  STORAGE = 'authorized-storage-accounts',
  CITATION = 'authorized-citation-accounts',
  LINK = 'authorized-link-accounts',
}

export enum ConfiguredAddonType {
  STORAGE = 'configured-storage-addons',
  CITATION = 'configured-citation-addons',
  LINK = 'configured-link-addons',
}
