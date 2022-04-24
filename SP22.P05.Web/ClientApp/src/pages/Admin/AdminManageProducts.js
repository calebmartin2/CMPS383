import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Dropdown, DropdownButton, Form, FormControl, Modal, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { EditProduct } from "../../components/EditProductModal";
import { checkForRole } from "../Auth/checkForRole";

export function AdminManageProducts() {
    const [products, setProducts] = useState([]);
    const [currentEditProduct, setCurrentEditProduct] = useState(null);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        document.title = "ICE - Manage Products"
        const controller = new AbortController();
        const delayDebounceFn = setTimeout(() => {
            axios({
                signal: controller.signal,
                url: '/api/products/manage',
                params: { query: search },
                method: 'get',
            })
                .then(function (response) {
                    setProducts(response.data);
                })
                .catch(function (error) {
                });
        }, 300)
        return () => {
            controller.abort();
            clearTimeout(delayDebounceFn);
        }
    }, [search, show])

    async function changeStatus(id, status) {
        axios.put('/api/products/change-status/' + id + '/' + status)
            .then(function (response) {
            })
            .catch(function (error) {
            });
    }

    function deleteProduct(id) {
        axios.delete('/api/products/' + id)
            .then(function (response) {
                axios({
                    url: '/api/products/manage',
                    params: { query: search },
                    method: 'get',
                })
                    .then(function (response) {
                        setProducts(response.data);
                    })
            })
    }

    function handleEditShow(product) {
        setCurrentEditProduct(product)
        handleShow();
    }

    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col sm={12} md={6} lg={8}>
                    <h1>Manage Products</h1>
                </Col>
                <Col sm={12} md={6} lg={4}>
                    <Form onSubmit={e => { e.preventDefault() }}>
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Form>
                </Col>
            </Row>

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th>Name</th>
                        <th>Publisher</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={{width: "2em"}}><img src={product.iconName} alt={"icon"} style={{width: "2em"}}/></td>
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
                                    {product.fileName && <Dropdown.Item as="button"><Link to={product.fileName} target="_blank" download>Download</Link></Dropdown.Item>}
                                    <Dropdown.Item as="button" onClick={() => handleEditShow(product)}>Edit Info</Dropdown.Item>
                                    <Dropdown.Item as="button" variant="danger" onClick={() => { if (window.confirm('Delete ' + product.name + ' from the system? THIS ACTION IS IRREVERSABLE.')) deleteProduct(product.id) }}>Delete</Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <EditProduct product={currentEditProduct} handleClose={handleClose} />
            </Modal>
        </>
    )
}
