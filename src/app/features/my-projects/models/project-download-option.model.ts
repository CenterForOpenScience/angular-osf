export type ProjectDownloadOptionType = 'metadata' | 'osf-files' | 'addon';

export interface ProjectDownloadOption {
  id: string;
  label: string;
  type: ProjectDownloadOptionType;
  downloadLink?: string;
  labelParams?: Record<string, string>;
}
