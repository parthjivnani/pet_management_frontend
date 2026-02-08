import { SideLink } from "@/models/sidelinks";
import { useMemo } from "react";
import { PawPrint, FileText, Settings, ClipboardList } from "lucide-react";
import { getRole } from "@/lib/utils";

export default function useSidelinks() {
  const role = getRole();
  const isAdmin = role?.toLowerCase() === "admin";

  const sidelinks = useMemo<SideLink[]>(() => {
    const links: SideLink[] = [
      {
        title: "Browse Pets",
        href: "/pets",
        label: "",
        icon: <PawPrint size={20} />,
      },
      {
        title: "My Applications",
        href: "/my-applications",
        label: "",
        icon: <FileText size={20} />,
      },
    ];
    if (isAdmin) {
      links.push(
        {
          title: "Manage Pets",
          href: "/pet/manage",
          label: "",
          icon: <Settings size={20} />,
        },
        {
          title: "Adoption Requests",
          href: "/admin/applications",
          label: "",
          icon: <ClipboardList size={20} />,
        },
      );
    }
    return links;
  }, [isAdmin]);

  return { sidelinks };
}
