import { Navigate } from "react-router-dom";

export function checkForRole(string) {
    if (JSON.parse(localStorage.getItem("user") === null)) {
        return <Navigate to="/" />;
    }
    const rolesArray = JSON.parse(localStorage.getItem("user")).roles;
    if (!rolesArray.includes(string)) {
        return <Navigate to="/" />;
    }
}

export function handleCartView(string) {
    if (JSON.parse(localStorage.getItem("user") === null)) {
        return;
    }
    const rolesArray = JSON.parse(localStorage.getItem("user")).roles;
    if (rolesArray.includes("User")) {
        return;
    }
    return <Navigate to="/" />;
}