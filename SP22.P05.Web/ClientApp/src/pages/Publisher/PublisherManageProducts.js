import axios from "axios";
import { useEffect, useState } from 'react';
import { Breadcrumb, Button, Dropdown, DropdownButton, Modal, Table, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AddProduct } from "../../components/AddProductModal";
import { EditProduct } from "../../components/EditProductModal";
import { UpdateProductFileModal } from "../../components/UpdateProductFileModal";

export default function PublisherManageProducts() {
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentEditProduct, setCurrentEditProduct] = useState(null);

    const handleClose = () => {
        fetchProducts();
        setShow(false);
    }

    const handleShow = () => setShow(true);

    async function fetchProducts() {
        axios.get('/api/publisher/products')
            .then(function (response) {
                setLoading(true);
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

    function handleEditShow(product) {
        setModalType("Edit")
        setCurrentEditProduct(product);
        handleShow();
    }

    function handleUpdateFileShow(product) {
        setModalType("UpdateFile")
        setCurrentEditProduct(product)
        handleShow();
    }

    function handleAddShow() {
        setModalType("Add");
        handleShow();
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/publisher" linkProps={{ to: "/publisher" }}>Publisher Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>

            <Modal show={show} onHide={handleClose}>
                {modalType === "Add" && <AddProduct handleClose={handleClose} />}
                {modalType === "Edit" && <EditProduct product={currentEditProduct} handleClose={handleClose} />}
                {modalType === "UpdateFile" && <UpdateProductFileModal product={currentEditProduct} handleClose={handleClose} />}
            </Modal>

            {!loading && <Button variant="primary" className="custom-primary-btn mb-3" onClick={() => handleAddShow()}>Add Product</Button>}
            {loading
                ? <Spinner animation="border" variant="info" />
                : products.length > 0 ?
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.status === 0 ? "Active" : product.status === 1 ? "Hidden" : product.status === 2 ? "Inactive" : null}</td>
                                    <td>
                                        <DropdownButton id="dropdown-item-button" title="Actions">
                                            <Dropdown.Item as="button"><Link to={`/product/${product.id}/${product.name.replace(/ /g, "_")}`} style={{ textDecoration: 'none' }}>Go to Store Page</Link></Dropdown.Item>
                                            {product.fileName && <Dropdown.Item as="button"> <Link to={product.fileName} target="_blank" download>Download</Link></Dropdown.Item>}
                                            <Dropdown.Item as="button" onClick={() => handleEditShow(product)} >Edit Info</Dropdown.Item>
                                            <Dropdown.Item as="button" onClick={() => handleUpdateFileShow(product)} >Update File</Dropdown.Item>
                                        </DropdownButton>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </Table>
                    : <h1>No products</h1>}
        </>
    );
}