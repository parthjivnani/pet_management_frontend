export type AdoptionStatus = "Pending" | "Approved" | "Rejected";

export interface Adoption {
  _id: string;
  pet: any;
  user: any;
  status: AdoptionStatus;
  message?: string;
  createdOn?: string;
  modifiedOn?: string;
}

export interface AdoptionListResponse {
  list: Adoption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
