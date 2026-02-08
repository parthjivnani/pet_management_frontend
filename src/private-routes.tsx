import { Navigate, Route, Routes } from "react-router";
import AdminLayout from "./layouts/admin-panel";
import { getToken } from "./lib/utils";
import HomePage from "./modules/home";
import ManagePetsPage from "./modules/pets/manage";
import SpeciesManagementPage from "./modules/species";
import MyApplicationsPage from "./modules/my-applications";
import AdminApplicationsPage from "./modules/admin-applications";

function PrivateRoutes() {
  return (
    <AuthenticatedTemplate>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/pet/manage" element={<ManagePetsPage />} />
          <Route path="/species" element={<SpeciesManagementPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route
            path="/admin/applications"
            element={<AdminApplicationsPage />}
          />
        </Route>
      </Routes>
    </AuthenticatedTemplate>
  );
}

export default PrivateRoutes;

export const AuthenticatedTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const Authenticated = getToken() !== null;
  return Authenticated ? children : <Navigate to="/pets" replace />;
};
