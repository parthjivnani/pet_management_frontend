import { useState } from "react";
import { Navigate } from "react-router";
import {
  useGetSpeciesQuery,
  useDeleteSpeciesMutation,
} from "@/services/species";
import { Button } from "@/components/custom/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import DataTable from "@/components/common/data-table";
import useColumns from "./use-columns";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import SpeciesAddEditPage from "./add-edit";
import DeleteModal from "@/components/common/delete-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import showToast from "@/components/common/toast";
import Loader from "@/components/common/loader";
import { getRole } from "@/lib/utils";

function SpeciesManagementPage() {
  const role = getRole();
  const isAdmin = role?.toLowerCase() === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { data, isLoading, refetch } = useGetSpeciesQuery(
    { limit: 100 },
    {
      selectFromResult: ({ data, ...rest }) => ({
        data: data?.result?.list ?? [],
        ...rest,
      }),
    },
  );

  const [deleteSpecies] = useDeleteSpeciesMutation();

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
    await deleteSpecies(id)
      .then((res: any) => {
        showToast(res?.data?.message, "success");
        setOpenDeleteModal(false);
        refetch();
      })
      .catch((error: any) => {
        showToast(error?.data?.message, "error");
      });
  };

  const columns = useColumns(handleOpen, handleOpenDeleteModal);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="flex justify-between px-4 py-2 items-center h-[52px]">
        <h1 className="font-semibold text-lg">Species Management</h1>
        <div className="flex items-center">
          <Button
            className="ml-2 flex items-center"
            variant="default"
            onClick={() => handleOpen(null)}
          >
            <Plus size={15} className="mr-1" />
            Add Species
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
        <DrawerContent className="flex h-full flex-col overflow-hidden p-0">
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            <SpeciesAddEditPage id={id} handleClose={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="p-4 w-[400px]">
          <DeleteModal
            message="Are you sure you want to delete this species?"
            handleDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SpeciesManagementPage;
