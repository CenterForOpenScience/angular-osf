export interface WikiModel {
  id: string;
  name: string;
  kind: string;
}

export interface WikiVersion {
  id: string;
  createdAt: string;
  createdBy: string | undefined;
}

export interface ComponentWiki {
  id: string;
  title: string;
  list: WikiModel[];
}

export interface HomeWiki {
  id: string;
  name: string;
  contentType: string;
  downloadLink: string;
  content?: string;
}
