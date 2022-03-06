import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";

export function AdminVerifyPublishers() {
    const [pendingPublisher, setPendingPublisher] = useState([]);
    async function fetchPendingPublisher() {
        axios.get('/api/users/get-pending-publishers')
            .then(function (response) {
                console.log(response.data);
                const data = response.data;
                setPendingPublisher(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    useEffect(() => {
        document.title = "Admin - Verify Publishers"
        fetchPendingPublisher();
    }, []);

    function VerifyPublisher(id) {
        var bodyFormData = new FormData();
        bodyFormData.append('id', id);

        axios({
            method: "post",
            url: "/api/users/verify-publisher",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
                fetchPendingPublisher();
              console.log(response);
            })
            .catch(function (response) {
              console.log(response);
            });
          
    }

    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Portal</Breadcrumb.Item>
                <Breadcrumb.Item active>Verify Incoming Publishers</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Verify Incoming Publishers</h1>

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Company Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingPublisher.map((pendingPublisher) => (
                        <tr key={pendingPublisher.id}>
                            <td>{pendingPublisher.userName}</td>
                            <td>{pendingPublisher.companyName}</td>
                            <td><Button variant="primary" onClick={() => { if (window.confirm('Verify ' + pendingPublisher.userName + ' of company ' + pendingPublisher.companyName + ' to be a publisher?')) VerifyPublisher(pendingPublisher.id) }}>Add</Button> <Button variant="danger">Deny</Button></td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>

    )
}