import { Breadcrumb } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { checkForRole } from "../checkForRole";


export function AdminManageTags() {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        document.title = "Admin - Add Tags"
        async function fetchTags() {
            axios.get('/api/products/get-tags')
                .then(function (response) {
                    console.log(response.data);
                    const data = response.data;
                    setTags(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        fetchTags();
    }, [])

    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Add Tags</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Add Tags</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag) => (
                        <tr key={tag.id}>
                            <td>{tag.name}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}