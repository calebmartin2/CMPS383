import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";

export function AdminManageProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "Admin - Manage Products"
        fetchProducts();
    }, [])
    async function fetchProducts() {
        axios.get('/api/products/manage')
            .then(function (response) {
                console.log(response.data);
                const data = response.data;
                setProducts(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function changeStatus(id, status) {
        axios.put('/api/products/change-status/' + id + '/' + status)
            .then(function (response) {
                console.log(response.data);
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
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Publisher</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((products) => (
                        <tr key={products.id}>
                            <td>{products.name}</td>
                            <td>{products.publisherName}</td>
                            <td><Form>
                                <div className="mb-3" onChange={(e) => {changeStatus(products.id, e.target.id) }}>
                                    <Form.Check
                                        inline
                                        label="Active"
                                        name="group1"
                                        type={'radio'}
                                        id={`0`}
                                        defaultChecked={products.status === 0}
                                    />
                                    <Form.Check
                                        inline
                                        label="Hidden"
                                        name="group1"
                                        type={'radio'}
                                        id={`1`}
                                        defaultChecked={products.status === 1}
                                    />
                                    <Form.Check
                                        inline
                                        label="Inactive"
                                        name="group1"
                                        type={'radio'}
                                        id={`2`}
                                        defaultChecked={products.status === 2}
                                    />
                                </div>
                            </Form></td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}
