import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";
import { Breadcrumb } from "react-bootstrap";

export function AdminPortal() {

    return (
        <>
            {checkForRole("Admin")}

            <Breadcrumb>
                <Breadcrumb.Item active>Admin Portal</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Admin Portal</h1>
            <Link to="./add-tags">Add Tags</Link>
            <Link to="./verify-publishers">Verify Incoming Publishers</Link>
        </>
    )
}