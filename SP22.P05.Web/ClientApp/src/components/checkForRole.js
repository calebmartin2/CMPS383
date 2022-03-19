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

export function checkForRoleBool(string) {
    if (JSON.parse(localStorage.getItem("user") === null)) {
        return true;
    }
    const rolesArray = JSON.parse(localStorage.getItem("user")).roles;
    if (!rolesArray.includes(string)) {
        return false;
    }
    return true;
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