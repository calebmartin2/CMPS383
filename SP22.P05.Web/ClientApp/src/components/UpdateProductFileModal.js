import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useRef, useState } from "react";
import axios from "axios";

export function UpdateProductFileModal({ product, handleClose }) {

    const fileRef = useRef(null);
    const [addEditLoading, setAddEditLoading] = useState(false);
    const [addProductError, setAddProductError] = useState(false);
    const [showFileUnchanged, setFileUnchanged] = useState(true);

    function handleUnchangedShow() {
        fileRef.current && fileRef.current.files.length === 0 ? setFileUnchanged(true) : setFileUnchanged(false)
    }

    const handleUpdateFile = (e) => {
        setAddEditLoading(true);
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append('productId', product.id)
        bodyFormData.append('file', fileRef.current.files[0])
        axios({
            method: "post",
            url: "/api/file/updatefile",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                handleClose();
                setAddEditLoading(false);
            })
            .catch(function (response) {
                setAddProductError(true);
                setAddEditLoading(false);
            });
    }

    return (
        <>
            <Modal.Header><Modal.Title>Update File</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdateFile}>
                    <Form.Group className="mb-4">
                        <Form.Label>File {showFileUnchanged && "(unchanged)"}</Form.Label>
                        <InputGroup>
                            <Form.Control required type="file" ref={fileRef} onInput={handleUnchangedShow}></Form.Control>
                        </InputGroup>
                    </Form.Group>
                    <Modal.Footer>
                        <Button className="custom-primary-btn" variant="primary" type="submit" disabled={addEditLoading}>
                            {addEditLoading ? <><Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> Updating File </> : 'Update File'}
                        </Button>
                        <Button variant="danger" onClick={handleClose}>
                            Discard
                        </Button>
                    </Modal.Footer>
                    {addProductError && <p style={{ marginTop: "1em", background: "#500000", padding: "1em" }}>Invalid Submission</p>}
                </Form>
            </Modal.Body>

        </>
    )
}
