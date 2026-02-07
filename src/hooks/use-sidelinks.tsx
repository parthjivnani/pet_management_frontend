import { SideLink } from "@/models/sidelinks";
import { useState } from "react";
import { Network } from "lucide-react";

export default function useSidelinks() {

  const [sidelinks] = useState<SideLink[]>([
    {
      title: "Categories",
      href: "/categories/list",
      label: "",
      icon: <Network size={20} />,
    }
  ]);

  return { sidelinks };
}
