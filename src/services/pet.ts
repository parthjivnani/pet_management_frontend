import { baseApi } from "./base-api";
import type { PetListParams, PetListResponse, PetFormData } from "@/models/pet";

const petApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPets: builder.query<{ result: PetListResponse }, PetListParams | void>({
      query: (params = {}) => ({
        url: "/pets",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.result?.list
          ? [
              ...result.result.list.map(({ _id }) => ({
                type: "PET" as const,
                id: _id,
              })),
              { type: "PET", id: "LIST" },
            ]
          : [{ type: "PET", id: "LIST" }],
    }),
    getPetById: builder.query<{ result: any }, string>({
      query: (id) => ({ url: `/pets/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "PET", id }],
    }),
    createPet: builder.mutation({
      query: (body: FormData | PetFormData) => ({
        url: "/pets",
        method: "POST",
        body,
        ...(body instanceof FormData
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: [{ type: "PET", id: "LIST" }],
    }),
    updatePet: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: FormData | Partial<PetFormData>;
      }) => ({
        url: `/pets/${id}`,
        method: "PUT",
        body,
        ...(body instanceof FormData
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "PET", id },
        { type: "PET", id: "LIST" },
      ],
    }),
    deletePet: builder.mutation({
      query: (id: string) => ({ url: `/pets/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "PET", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPetsQuery,
  useGetPetByIdQuery,
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petApi;
