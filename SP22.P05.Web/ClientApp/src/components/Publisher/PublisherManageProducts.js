import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button, Dropdown, DropdownButton, Modal, Table, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AddOrEditProduct } from "./AddOrEditProduct";
import { UpdateProduct } from "./UpdateProduct";

export default function PublisherManageProducts() {
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addEditLoading, setAddEditLoading] = useState(false);
    const [addProductError, setAddProductError] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [blurb, setBlurb] = useState("");
    const [price, setPrice] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [isUpdateFile, setIsUpdateFile] = useState(false);
    const [productId, setProductId] = useState("");
    const fileRef = useRef(null);
    const iconRef = useRef(null);
    const pictureRef = useRef(null);

    const handleClose = () => {
        setName("");
        setDescription("");
        setPrice("");
        setBlurb("");
        setAddProductError(false);
        setShow(false);
        setIsEdit(false);
        setIsUpdateFile(false);
    }
    const handleShow = () => setShow(true);

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
        setAddEditLoading(true);
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('description', description);
        bodyFormData.append('blurb', blurb);
        bodyFormData.append('price', price)
        bodyFormData.append('file', fileRef.current.files[0])
        bodyFormData.append('icon', iconRef.current.files[0])
        for (var i = 0; i < pictureRef.current.files.length; i++) {
            bodyFormData.append("pictures", pictureRef.current.files[i]);
        }

        axios({
            method: "post",
            url: "/api/products",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                fetchProducts();
                handleClose();
                setAddEditLoading(false);
            })
            .catch(function (response) {
                setAddProductError(true);
                console.log(response);
                setAddEditLoading(false);
            });
    }


    const handleEdit = (e) => {
        setAddEditLoading(true);
        e.preventDefault();
        console.log(productId);
        var bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('description', description);
        bodyFormData.append('blurb', blurb);
        bodyFormData.append('price', price);
        bodyFormData.append('icon', iconRef.current.files[0]);
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
                setAddEditLoading(false);
            })
            .catch(function (error) {
                setAddProductError(true);
                console.log(error);
                setAddEditLoading(false);
            })
    }

    function handleEditShow(product) {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setProductId(product.id);
        setBlurb(product.blurb)
        setIsEdit(true);
        handleShow();
    }

    const handleUpdateFile = (e) => {
        setAddEditLoading(true);
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append('productId', productId)
        bodyFormData.append('file', fileRef.current.files[0])
        console.log("PROD: " + productId);
        axios({
            method: "post",
            url: "/api/file/updatefile",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                console.log(response);
                fetchProducts();
                handleClose();
                setAddEditLoading(false);
            })
            .catch(function (response) {
                setAddProductError(true);
                console.log(response);
                setAddEditLoading(false);
            });

    }

    function handleUpdateFileShow(product) {
        setProductId(product.id);
        setIsUpdateFile(true);
        handleShow();
    }

    function showModalTitle() {
        if (isEdit) {
            return "Edit Product"
        }
        if (isUpdateFile) {
            return "Update File"
        }
        return "Add Product"
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/publisher" linkProps={{ to: "/publisher" }}>Publisher Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header><Modal.Title>{showModalTitle()}</Modal.Title></Modal.Header>
                <Modal.Body>
                    {isUpdateFile ? updateFileForm() : addOrEditForm()}
                </Modal.Body>
            </Modal>

            {loading
                ? <Spinner animation="border" variant="info" />
                 : products.length > 0 && !loading ?
                <>
                    <Button variant="primary" className="custom-primary-btn mb-3" onClick={handleShow}>
                        Add Product
                    </Button>
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
                                    {/* Shouldn't be hardcoding this, stuck with it for now */}
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
                    </Table></>
                : <><Button variant="primary" className="custom-primary-btn mb-3" onClick={handleShow}>
                    Add Product
                </Button><h1>No products</h1></>}
        </>
    );

    function addOrEditForm() {
        return AddOrEditProduct(isEdit, handleEdit, handleAdd, name, setName, blurb, setBlurb, description, setDescription, price, setPrice, fileRef, iconRef, pictureRef, addEditLoading, handleClose, addProductError);
    }

    function updateFileForm() {
        return (
            UpdateProduct(handleUpdateFile, fileRef, addEditLoading, handleClose, addProductError)
        )
    }
}