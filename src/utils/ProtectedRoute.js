import { Navigate, Outlet } from "react-router-dom";
import { LocalStorageService } from "../services/LocalStorageService";



const ProtectedRoute = ({
    redirection = '/'
}) => {

    const validToken = LocalStorageService.getToken();
    const isTokenExpired = LocalStorageService.isTokenExpired();
    if (isTokenExpired) {
        LocalStorageService.signOut();
        return <Navigate to={redirection} />
    }
    return <Outlet />
}

export default ProtectedRoute;