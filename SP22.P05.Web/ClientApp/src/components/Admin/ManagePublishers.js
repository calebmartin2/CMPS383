import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Breadcrumb, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";

export function ManagePublishers() {
    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        document.title = "ICE - Manage Publishers"
        fetchPublishers();
    }, [])

    async function fetchPublishers() {
        axios.get('/api/users/get-approved-publishers')
            .then(function (response) {
                console.log(response.data);
                const data = response.data;
                setPublishers(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function deletePublisher(id) {
        axios.delete('/api/users/delete-publisher/' + id)
            .then(function (response) {
                fetchPublishers();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Publishers</Breadcrumb.Item>
            </Breadcrumb>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {publishers.map((publisher) => (
                        <tr key={publisher.id}>
                            <td>{publisher.userName}</td>
                            <td>{publisher.companyName}</td>
                            <td><a style={{ color: "#FFFFFF" }} href={"mailto:" + publisher.email}>{publisher.email}</a></td>
                            <td><Button variant="danger" onClick={() => { if (window.confirm('Remove ' +  publisher.userName + ' of company ' + publisher.companyName + ' to not be a publsher anymore?'))deletePublisher(publisher.id)}}>Remove</Button></td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}