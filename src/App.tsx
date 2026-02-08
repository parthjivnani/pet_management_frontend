import { BrowserRouter, Route, Routes } from "react-router";
import PrivateRoutes from "./private-routes";
import AuthRoutes from "./modules/auth/routes";
import PublicLayout from "./layouts/public-layout";
import PetListPage from "./modules/pets";
import PetDetailPage from "./modules/pets/pet-detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route element={<PublicLayout />}>
          <Route path="/pets" element={<PetListPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
        </Route>
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
