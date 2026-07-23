import { MenuItem } from 'primeng/api';

import { ProjectDownloadOption } from './project-download-option.model';

export interface ProjectDownloadMenuItem extends MenuItem {
  option: ProjectDownloadOption;
  labelParams?: Record<string, string>;
}
