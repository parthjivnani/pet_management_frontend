import { baseApi } from "./base-api";

const adoptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyApplications: builder.query({
      query: () => ({ url: "/adoptions/my", method: "GET" }),
      providesTags: ["ADOPTION"],
    }),
    getAllAdoptions: builder.query({
      query: (params?: { page?: number; limit?: number; status?: string }) => ({
        url: "/adoptions",
        method: "GET",
        params,
      }),
      providesTags: ["ADOPTION"],
    }),
    getAdoptionById: builder.query({
      query: (id: string) => ({ url: `/adoptions/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "ADOPTION" as const, id }],
    }),
    applyAdoption: builder.mutation({
      query: (data: { petId: string; message?: string }) => ({
        url: "/adoptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ADOPTION", "PET"],
    }),
    approveAdoption: builder.mutation({
      query: (id: string) => ({
        url: `/adoptions/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["ADOPTION", "PET"],
    }),
    rejectAdoption: builder.mutation({
      query: (id: string) => ({
        url: `/adoptions/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["ADOPTION"],
    }),
  }),
});

export const {
  useGetMyApplicationsQuery,
  useGetAllAdoptionsQuery,
  useGetAdoptionByIdQuery,
  useApplyAdoptionMutation,
  useApproveAdoptionMutation,
  useRejectAdoptionMutation,
} = adoptionApi;
