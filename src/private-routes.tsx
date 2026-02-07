import { Navigate, Route, Routes } from "react-router";
import CategoryRoutes from "./modules/categories/routes";
import AdminLayout from "./layouts/admin-panel";
import { getToken } from "./lib/utils";
import HomePage from "./modules/home";
function PrivateRoutes() {
    return (
        <>
            <AuthenticatedTemplate>
                <Routes>
                    <Route element={<AdminLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/categories/*" element={<CategoryRoutes />} />
                    </Route>
                </Routes>
            </AuthenticatedTemplate>
        </>
    );
}

export default PrivateRoutes;

export const AuthenticatedTemplate = ({ children }: { children: React.ReactNode }) => {
    const Authenticated = getToken() !== null;
    return Authenticated ? children : <Navigate to="/auth/sign-in" replace />;
}
