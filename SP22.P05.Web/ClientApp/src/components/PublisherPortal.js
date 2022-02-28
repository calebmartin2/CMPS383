import { Navigate } from "react-router-dom";

export function PublisherPortal() {
    // TODO: Ask if there's a better way for hiding pages for users without that role
    function checkForPublisher() {
        if (JSON.parse(localStorage.getItem("user") === null)) {
            return <Navigate to="/" />;
        }
        const rolesArray = JSON.parse(localStorage.getItem("user")).roles;
        if (!rolesArray.includes("Publisher")) {
            return <Navigate to="/" />;
        }
    }
    return (
        <>
            {checkForPublisher()}
            <h1>Publisher Portal</h1>
        </>
    )
}