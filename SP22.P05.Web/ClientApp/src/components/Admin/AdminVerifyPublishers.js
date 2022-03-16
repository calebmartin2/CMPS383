import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";

export function AdminVerifyPublishers() {
    const [pendingPublisher, setPendingPublisher] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchPendingPublisher() {
        axios.get('/api/users/get-pending-publishers')
            .then(function (response) {
                console.log(response.data);
                const data = response.data;
                setPendingPublisher(data);
                setLoading(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function deletePendingPublisher(id) {
        axios.delete('/api/users/delete-publisher/' + id)
            .then(function (response) {
                fetchPendingPublisher();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        document.title = "ICE - Verify Publishers"
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
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Verify Incoming Publishers</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Verify Incoming Publishers</h1>
            {!loading ? "Loading" : pendingPublisher.length > 0 && loading ?
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
                        {pendingPublisher.map((pendingPublisher) => (
                            <tr key={pendingPublisher.id}>
                                <td>{pendingPublisher.userName}</td>
                                <td>{pendingPublisher.companyName}</td>
                                <td><a style={{ color: "#FFFFFF" }} href={"mailto:" + pendingPublisher.email}>{pendingPublisher.email}</a></td>
                                <td>
                                    <Button variant="primary" className="custom-primary-btn" onClick={() => { if (window.confirm('Verify ' + pendingPublisher.userName + ' of company ' + pendingPublisher.companyName + ' to be a publisher?')) VerifyPublisher(pendingPublisher.id) }}>Approve</Button>
                                    <Button variant="danger" style={{ marginLeft: "1em" }} onClick={() => { if (window.confirm('Deny ' + pendingPublisher.userName + ' of company ' + pendingPublisher.companyName + 'to not be a publsher?')) deletePendingPublisher(pendingPublisher.id) }}>Deny</Button>
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </Table>
                : <h3 style={{color: "#cccccc"}}>No incoming publishers</h3>}

        </>

    )
}