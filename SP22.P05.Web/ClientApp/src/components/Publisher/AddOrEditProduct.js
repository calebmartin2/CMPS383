import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";

export function AddOrEditProduct(isEdit, handleEdit, handleAdd, name, setName, blurb, setBlurb, description, setDescription, price, setPrice, fileRef, iconRef, pictureRef, addEditLoading, handleClose, addProductError) {
    return <Form onSubmit={isEdit ? handleEdit : handleAdd}>
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
        {!isEdit && <Form.Group className="mb-4">
            <Form.Label>File</Form.Label>
            <Form.Control type="file" ref={fileRef}></Form.Control>
        </Form.Group>}
        <Form.Group className="mb-4">
            <Form.Label>Icon (must be 1:1, max size 100KiB)</Form.Label>
            <Form.Control type="file" accept="image/png, image/jpeg, image/webp" ref={iconRef}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-4">
            <Form.Label>Pictures (must be 16:9, max size 5MiB)</Form.Label>
            <Form.Control type="file" accept="image/png, image/jpeg, image/webp" ref={pictureRef} multiple></Form.Control>
        </Form.Group>
        <Modal.Footer>
            <Button className="custom-primary-btn" variant="primary" type="submit" disabled={addEditLoading}>
                {addEditLoading ? <><Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true" />{isEdit ? <> Saving Changes</> : <> Adding</>}</> : isEdit ? <>Save Changes</> : <>Add</>}
            </Button>
            <Button variant="danger" onClick={handleClose}>
                Discard
            </Button>
        </Modal.Footer>
        {addProductError && <p style={{ marginTop: "1em", background: "#500000", padding: "1em" }}>Invalid Submission</p>}
    </Form>;
}
