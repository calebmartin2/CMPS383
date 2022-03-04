import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";

export function AdminPortal() {
    
    return (
        <>
            {checkForRole("Admin")}
            <h1>Admin Portal</h1>
            <Link to="./add-tags">Add Tags</Link>
        </>
    )
}