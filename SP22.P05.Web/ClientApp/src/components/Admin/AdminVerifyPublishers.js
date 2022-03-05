import { Breadcrumb } from "react-bootstrap"
import { Link } from "react-router-dom"
import { checkForRole } from "../checkForRole"
export function AdminVerifyPublishers() {
    
    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Portal</Breadcrumb.Item>
                <Breadcrumb.Item active>Verify Incoming Publishers</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Verify Incoming Publisers</h1>
        </>

    )
}