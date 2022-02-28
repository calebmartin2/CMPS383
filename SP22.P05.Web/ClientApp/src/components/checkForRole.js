import { Navigate } from "react-router-dom";

// TODO: Ask if there's a better way for hiding pages for users without that role
export function checkForRole(string) {
    if (JSON.parse(localStorage.getItem("user") === null)) {
        return <Navigate to="/" />;
    }
    const rolesArray = JSON.parse(localStorage.getItem("user")).roles;
    if (!rolesArray.includes(string)) {
        return <Navigate to="/" />;
    }
}
