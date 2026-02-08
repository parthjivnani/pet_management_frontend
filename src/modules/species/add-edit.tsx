import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import SpeciesForm from "./species-form";

interface SpeciesAddEditProps {
  id: string | null;
  handleClose: () => void;
}

function SpeciesAddEditPage({ id, handleClose }: SpeciesAddEditProps) {
  return (
    <>
      <DrawerHeader className="pl-0">
        <DrawerTitle>Species</DrawerTitle>
        <DrawerDescription>{id ? "Edit" : "Add"} species</DrawerDescription>
      </DrawerHeader>
      <SpeciesForm id={id} handleClose={handleClose} />
    </>
  );
}

export default SpeciesAddEditPage;
