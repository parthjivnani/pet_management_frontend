import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  speciesSchema,
  type SpeciesSchemaType,
} from "@/validation-schema/species";
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
  useCreateSpeciesMutation,
  useGetSpeciesByIdQuery,
  useUpdateSpeciesMutation,
} from "@/services/species";
import showToast from "@/components/common/toast";

interface SpeciesFormProps {
  id: string | null;
  handleClose: () => void;
}

function SpeciesForm({ id, handleClose }: Readonly<SpeciesFormProps>) {
  const { data: speciesData } = useGetSpeciesByIdQuery(id!, { skip: !id });
  const species = speciesData?.result;
  const [createSpecies] = useCreateSpeciesMutation();
  const [updateSpecies] = useUpdateSpeciesMutation();

  const form = useForm<SpeciesSchemaType>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (id && species) {
      form.reset({
        name: species.name,
      });
    }
  }, [id, species, form]);

  const onSubmit = (data: SpeciesSchemaType) => {
    if (id) {
      updateSpecies({ id, body: { name: data.name } })
        .then((res: any) => {
          showToast(res?.data?.message, "success");
          handleClose();
        })
        .catch((err: any) => showToast(err?.data?.message, "error"));
    } else {
      createSpecies({ name: data.name })
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
                className={fieldState.invalid ? "text-foreground" : ""}
              >
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Species name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-2">
          <Button type="submit">{id ? "Update" : "Add"} Species</Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SpeciesForm;
