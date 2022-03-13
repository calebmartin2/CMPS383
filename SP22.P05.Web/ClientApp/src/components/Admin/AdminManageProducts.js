import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";

export function AdminManageProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "ICE - Manage Products"
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

    
    function deleteProudct(id) {
        axios.delete('/api/products/' + id)
            .then(function (response) {
                fetchProducts();
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
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.publisherName}</td>
                            <td><Form>
                                <div className="mb-3" onChange={(e) => {changeStatus(product.id, e.target.id) }}>
                                    <Form.Check
                                        inline
                                        label="Active"
                                        name="group1"
                                        type={'radio'}
                                        id={`0`}
                                        defaultChecked={product.status === 0}
                                    />
                                    <Form.Check
                                        inline
                                        label="Hidden"
                                        name="group1"
                                        type={'radio'}
                                        id={`1`}
                                        defaultChecked={product.status === 1}
                                    />
                                    <Form.Check
                                        inline
                                        label="Inactive"
                                        name="group1"
                                        type={'radio'}
                                        id={`2`}
                                        defaultChecked={product.status === 2}
                                    />
                                </div>
                            </Form></td>
                            { <td><Button variant="danger" onClick={() => { if (window.confirm('Delete ' +  product.name + ' to not be part of the store anymore?'))deleteProudct(product.id)}}>Delete</Button></td> }
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}
