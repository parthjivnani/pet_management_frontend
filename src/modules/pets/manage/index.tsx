import { useState } from "react";
import { Navigate } from "react-router";
import { useGetPetsQuery, useDeletePetMutation } from "@/services/pet";
import { Button } from "@/components/custom/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import DataTable from "@/components/common/data-table";
import useColumns from "./use-columns";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import PetAddEditPage from "./add-edit";
import DeleteModal from "@/components/common/delete-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import showToast from "@/components/common/toast";
import Loader from "@/components/common/loader";
import { getRole } from "@/lib/utils";

function ManagePetsPage() {
  const role = getRole();
  const isAdmin = role?.toLowerCase() === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { data, isLoading, refetch } = useGetPetsQuery(
    { limit: 100, status: "all" },
    {
      selectFromResult: ({ data, ...rest }) => ({
        data: data?.result?.list ?? [],
        ...rest,
      }),
    },
  );

  const [deletePet] = useDeletePetMutation();

  const handleClose = () => {
    setIsOpen(false);
    setId(null);
  };
  const handleOpen = (editId: string | null) => {
    setIsOpen(true);
    setId(editId);
  };
  const handleOpenDeleteModal = (deleteId: string) => {
    setOpenDeleteModal(true);
    setId(deleteId);
  };
  const handleDelete = async () => {
    if (!id) return;
    await deletePet(id)
      .then((res: any) => {
        showToast(res?.data?.message, "success");
        setOpenDeleteModal(false);
        refetch();
      })
      .catch((error: any) => {
        showToast(error?.data?.message, "error");
      });
  };

  const columns = useColumns(handleOpen, handleOpenDeleteModal, isAdmin);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="flex justify-between px-4 py-2 items-center h-[52px]">
        <h1 className="font-semibold text-lg">Manage Pets</h1>
        <div className="flex items-center">
          <Button
            className="ml-2 flex items-center"
            variant="default"
            onClick={() => handleOpen(null)}
          >
            <Plus size={15} className="mr-1" />
            Add Pet
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable columns={columns} data={data || []} />
          )}
        </CardContent>
      </Card>
      <Drawer
        direction="right"
        open={isOpen}
        onOpenChange={setIsOpen}
        onClose={handleClose}
      >
        <DrawerContent className="p-4">
          <PetAddEditPage id={id} handleClose={handleClose} />
        </DrawerContent>
      </Drawer>
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="p-4 w-[400px]">
          <DeleteModal
            message="Are you sure you want to delete this pet?"
            handleDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ManagePetsPage;
