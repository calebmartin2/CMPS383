import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { checkForRole } from "../checkForRole";


export function AdminAddTags() {
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