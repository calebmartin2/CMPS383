import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

export function ManagePublishers() {
    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        document.title = "ICE - Manage Publishers"
        async function fetchProducts() {
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
        fetchProducts();
    }, [])

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Publishers</Breadcrumb.Item>
            </Breadcrumb>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Company Name</th>
                    </tr>
                </thead>
                <tbody>
                    {publishers.map((publisher) => (
                        <tr key={publisher.id}>
                            <td>{publisher.userName}</td>
                            <td>{publisher.companyName}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}