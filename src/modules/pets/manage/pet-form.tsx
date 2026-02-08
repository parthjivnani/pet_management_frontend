import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema, type PetSchemaType } from "@/validation-schema/pet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import {
  useCreatePetMutation,
  useGetPetByIdQuery,
  useUpdatePetMutation,
} from "@/services/pet";
import { useGetSpeciesQuery } from "@/services/species";
import showToast from "@/components/common/toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "";

interface PetFormProps {
  id: string | null;
  handleClose: () => void;
}

function PetForm({ id, handleClose }: Readonly<PetFormProps>) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: petData } = useGetPetByIdQuery(id!, { skip: !id });
  const pet = petData?.result;
  const [createPet] = useCreatePetMutation();
  const [updatePet] = useUpdatePetMutation();
  const { data: speciesData } = useGetSpeciesQuery(
    { limit: 100 },
    {
      selectFromResult: ({ data }) => ({
        data: data?.result?.list ?? [],
      }),
    },
  );
  const speciesList = speciesData ?? [];

  const form = useForm<PetSchemaType>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: 0,
      description: "",
      status: "Available",
    },
  });

  useEffect(() => {
    if (id && pet) {
      form.reset({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        description: pet.description ?? "",
        status: pet.status ?? "Available",
      });
    }
  }, [id, pet, form]);

  const onSubmit = (data: PetSchemaType) => {
    const useFormData = !id || !!imageFile;
    if (useFormData) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("species", data.species);
      formData.append("breed", data.breed);
      formData.append("age", String(data.age));
      if (data.description) formData.append("description", data.description);
      if (data.status) formData.append("status", data.status);
      if (imageFile) formData.append("image", imageFile);

      if (id) {
        updatePet({ id, body: formData })
          .then((res: any) => {
            showToast(res?.data?.message, "success");
            handleClose();
          })
          .catch((err: any) => showToast(err?.data?.message, "error"));
      } else {
        createPet(formData)
          .then((res: any) => {
            showToast(res?.data?.message, "success");
            handleClose();
          })
          .catch((err: any) => showToast(err?.data?.message, "error"));
      }
    } else {
      if (!id) return;
      updatePet({
        id,
        body: {
          name: data.name,
          species: data.species,
          breed: data.breed,
          age: data.age,
          description: data.description,
          status: data.status,
        },
      })
        .then((res: any) => {
          showToast(res?.data?.message, "success");
          handleClose();
        })
        .catch((err: any) => showToast(err?.data?.message, "error"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn("h-9", { "text-foreground": fieldState.invalid })}
              >
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className={cn("h-9", {
                    "border-red-500": fieldState.invalid,
                  })}
                  placeholder="Pet name"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="species"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn("h-9", { "text-foreground": fieldState.invalid })}
              >
                Species <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={speciesList.length === 0}
                >
                  <SelectTrigger
                    className={cn("h-9 w-full", {
                      "border-red-500": fieldState.invalid,
                    })}
                  >
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesList.map((s) => (
                      <SelectItem key={s._id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn("h-9", { "text-foreground": fieldState.invalid })}
              >
                Breed <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className={cn("h-9", {
                    "border-red-500": fieldState.invalid,
                  })}
                  placeholder="e.g. Labrador"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn("h-9", { "text-foreground": fieldState.invalid })}
              >
                Age (years) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className={cn("h-9", {
                    "border-red-500": fieldState.invalid,
                  })}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  className="h-9"
                  placeholder="Short description"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(e.target.value as "Available" | "Adopted")
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Pet image</FormLabel>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            className="mt-1"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          {id && pet?.imageUrl && !imageFile && (
            <p className="text-xs text-muted-foreground mt-1">
              Current:{" "}
              <img
                src={API_BASE + pet.imageUrl}
                alt=""
                className="inline h-10 mt-1 rounded"
              />
            </p>
          )}
        </div>
        <Button type="submit" className="mt-4 w-full">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default PetForm;
