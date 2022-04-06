import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Breadcrumb, Button, Dropdown, DropdownButton, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../Auth/checkForRole";

export function AdminManageProducts() {
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [blurb, setBlurb] = useState("");
    const [price, setPrice] = useState("");
    const [productId, setProductId] = useState("");
    const iconRef = useRef(null);
    const pictureRef = useRef(null);



    const handleClose = () => {
        setName("");
        setDescription("");
        setPrice("");
        setBlurb("");
        setShow(false);
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        document.title = "ICE - Manage Products"
        fetchProducts();
    }, [])
    async function fetchProducts() {
        axios.get('/api/products/manage')
            .then(function (response) {
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


    const handleEdit = (e) => {
        e.preventDefault();
        console.log(productId);
        var bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('description', description);
        bodyFormData.append('blurb', blurb);
        bodyFormData.append('price', price);
        bodyFormData.append('icon', iconRef.current.files[0])
        bodyFormData.append('pictures', pictureRef.current.files);
        for (var i = 0; i < pictureRef.current.files.length; i++) {
            bodyFormData.append("pictures", pictureRef.current.files[i]);
        }

        axios({
            method: "put",
            url: "/api/products/" + productId,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                fetchProducts();
                handleClose();
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    function handleEditShow(product) {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setProductId(product.id);
        setBlurb(product.blurb);
        handleShow();
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.publisherName}</td>
                            <td>
                                <Form>
                                    <div className="mb-3" onChange={(e) => { changeStatus(product.id, e.target.id) }}>
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
                                </Form>
                            </td>
                            <td>
                                <DropdownButton id="dropdown-item-button" title="Actions">
                                    <Dropdown.Item as="button">
                                        <Link to={`/product/${product.id}/${product.name.replace(/ /g, "_")}`} style={{ textDecoration: 'none' }}>Go to Store Page</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => handleEditShow(product)}>Edit Info</Dropdown.Item>
                                    <Dropdown.Item as="button" variant="danger" onClick={() => { if (window.confirm('Delete ' + product.name + ' from the system? THIS ACTION IS IRREVERSABLE.')) deleteProudct(product.id) }}>Delete</Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header><Modal.Title>Edit Product</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
                        <Form.Group className="mb-2" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Name" maxLength="120" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formBasicBlurb">
                            <Form.Label>Blurb</Form.Label>
                            <Form.Control required type="text" placeholder="Blurb" maxLength="240" value={blurb} onChange={(e) => setBlurb(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formBasicDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required as="textarea" rows={5} placeholder="Description" maxLength="2000" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formBasicPrice">
                            <Form.Label>Price</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control required min="0.01" step="0.01" max="999.99" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Icon (must be 1:1, max size 100KiB)</Form.Label>
                            <Form.Control type="file" accept="image/png, image/jpeg, image/webp" ref={iconRef}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Pictures</Form.Label>
                            <Form.Control type="file" accept="image/png, image/jpeg, image/webp" ref={pictureRef} multiple></Form.Control>
                        </Form.Group>
                        <Button className="custom-primary-btn" variant="primary" type="submit">
                            Save Changes
                        </Button>
                        <Button variant="danger" onClick={handleClose} style={{ marginLeft: "0.5em" }}>
                            Discard
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
