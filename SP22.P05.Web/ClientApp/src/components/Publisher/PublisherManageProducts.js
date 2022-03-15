import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputGroup, Breadcrumb } from "react-bootstrap";

export default function PublisherManageProducts() {
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    async function fetchProducts() {
        axios.get('/api/publisher/products')
            .then(function (response) {
                setLoading(true);
                console.log(response.data);
                const data = response.data;
                setProducts(data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        document.title = "ICE - Manage Products"

        fetchProducts();
    }, [])

    const handleAdd = (e) => {
        axios.post('/api/products', {
            name: name,
            description: description,
            price: price
        })
            .then(function (response) {
                fetchProducts();
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/publisher" linkProps={{ to: "/publisher" }}>Publisher Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header><Modal.Title>Add Product</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAdd}>
                        <Form.Group className="mb-2" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formBasicDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required as="textarea" rows={5} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formBasicPrice">
                            <Form.Label>Price</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control required min="0.01" step="0.01" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </InputGroup>
                        </Form.Group>
                        <Button className="custom-primary-btn" variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            {loading ? "Loading" : products.length > 0 && !loading ?
                <>
                    <Button variant="primary" className="custom-primary-btn mb-3" onClick={handleShow}>
                        Add Product
                    </Button>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </Table></>
                : <><Button variant="primary" className="custom-primary-btn mb-3" onClick={handleShow}>
                    Add Product
                </Button><h1>No products</h1></>}
        </>
    );
}

