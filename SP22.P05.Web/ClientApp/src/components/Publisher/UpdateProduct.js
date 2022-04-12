import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";

export function UpdateProduct(handleUpdateFile, fileRef, addEditLoading, handleClose, addProductError) {
    return <Form onSubmit={handleUpdateFile}>
        <Form.Group className="mb-4">
            <Form.Label>File</Form.Label>
            <InputGroup>
                <Form.Control required type="file" ref={fileRef}></Form.Control>
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
    </Form>;
}
