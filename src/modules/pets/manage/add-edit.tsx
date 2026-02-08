import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import PetForm from "./pet-form";

interface PetAddEditProps {
  id: string | null;
  handleClose: () => void;
}

function PetAddEditPage({ id, handleClose }: PetAddEditProps) {
  return (
    <>
      <DrawerHeader className="pl-0">
        <DrawerTitle>Pet</DrawerTitle>
        <DrawerDescription>{id ? "Edit" : "Add"} pet</DrawerDescription>
      </DrawerHeader>
      <PetForm id={id} handleClose={handleClose} />
    </>
  );
}

export default PetAddEditPage;
