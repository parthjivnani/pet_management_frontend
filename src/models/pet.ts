export type PetStatus = "available" | "adopted";

export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
  status: PetStatus;
  createdOn?: string;
  modifiedOn?: string;
}

export interface PetListParams {
  page?: number;
  limit?: number;
  search?: string;
  species?: string;
  breed?: string;
  ageMin?: number;
  ageMax?: number;
  status?: string;
}

export interface PetListResponse {
  list: Pet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PetFormData {
  name: string;
  species: string;
  breed: string;
  age: number;
  description?: string;
  status?: PetStatus;
}
