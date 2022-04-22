import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../Auth/checkForRole";

export function ManagePublishers() {
    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        document.title = "ICE - Manage Publishers"
        fetchPublishers();
    }, [])

    async function fetchPublishers() {
        axios.get('/api/users/get-approved-publishers')
            .then(function (response) {
                const data = response.data;
                setPublishers(data);
            })
            .catch(function (error) {
            });
    }

    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Publishers</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Manage Publishers</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Company Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {publishers.map((publisher) => (
                        <tr key={publisher.id}>
                            <td>{publisher.userName}</td>
                            <td>{publisher.companyName}</td>
                            <td><a style={{ color: "#FFFFFF" }} href={"mailto:" + publisher.email}>{publisher.email}</a></td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}