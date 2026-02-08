export interface Species {
  _id: string;
  name: string;
  createdOn?: string;
  modifiedOn?: string;
}

export interface SpeciesListParams {
  page?: number;
  limit?: number;
}

export interface SpeciesListResponse {
  list: Species[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SpeciesFormData {
  name: string;
}
