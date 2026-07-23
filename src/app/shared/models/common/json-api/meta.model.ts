export interface ListMetaJsonApi {
  total: number;
  anonymous?: boolean;
  per_page?: number;
  version?: string;
}

export interface ItemMetaJsonApi {
  anonymous?: boolean;
  version?: string;
}
