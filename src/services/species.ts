import { baseApi } from "./base-api";
import type {
  SpeciesListParams,
  SpeciesListResponse,
  SpeciesFormData,
} from "@/models/species";

const speciesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecies: builder.query<
      { result: SpeciesListResponse },
      SpeciesListParams | void
    >({
      query: (params = {}) => ({
        url: "/species",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.result?.list
          ? [
              ...result.result.list.map(({ _id }) => ({
                type: "SPECIES" as const,
                id: _id,
              })),
              { type: "SPECIES", id: "LIST" },
            ]
          : [{ type: "SPECIES", id: "LIST" }],
    }),
    getSpeciesById: builder.query<{ result: Species }, string>({
      query: (id) => ({ url: `/species/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "SPECIES", id }],
    }),
    createSpecies: builder.mutation({
      query: (body: SpeciesFormData) => ({
        url: "/species",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "SPECIES", id: "LIST" }],
    }),
    updateSpecies: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: Partial<SpeciesFormData>;
      }) => ({
        url: `/species/${id}`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "SPECIES", id },
        { type: "SPECIES", id: "LIST" },
      ],
    }),
    deleteSpecies: builder.mutation({
      query: (id: string) => ({ url: `/species/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "SPECIES", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSpeciesQuery,
  useGetSpeciesByIdQuery,
  useCreateSpeciesMutation,
  useUpdateSpeciesMutation,
  useDeleteSpeciesMutation,
} = speciesApi;
