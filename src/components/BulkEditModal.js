import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
import InvoiceItem from './InvoiceItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditInvoiceList, updateEditedInvoice } from '../redux/bulkEditInvoiceSlice';
import { useNavigate } from 'react-router-dom';

const BulkEditModal = ({ children, id }) => {
    const [modalShow, setModalShow] = React.useState(false);
    const allBulkEditableInvoices = useSelector(selectEditInvoiceList)
    const oneItem = allBulkEditableInvoices.find(el => el.id == id)
    const [formData, setFormData] = useState(oneItem)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleHide = () => {
        setModalShow(false)
        const oneItem = allBulkEditableInvoices.find(el => el.id == id)
        setFormData(oneItem)
    }
    const handleShow = () => setModalShow(true)

    useEffect(() => {
        handleCalculateTotal();
    }, []);

    const handleRowDel = (itemToDelete) => {
        const updatedItems = formData.items.filter(
            (item) => item.itemId !== itemToDelete.itemId
        );
        setFormData({ ...formData, items: updatedItems });
        handleCalculateTotal();
    };

    const handleAddEvent = () => {
        const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        const newItem = {
            itemId: id,
            itemName: "",
            itemDescription: "",
            itemPrice: "1.00",
            itemQuantity: 1,
        };
        setFormData({
            ...formData,
            items: [...formData.items, newItem],
        });
        handleCalculateTotal();
    };

    const onItemizedItemEdit = (evt, id) => {
        const updatedItems = formData.items.map((oldItem) => {
            if (oldItem.itemId === id) {
                return { ...oldItem, [evt.target.name]: evt.target.value };
            }
            return oldItem;
        });

        setFormData({ ...formData, items: updatedItems });
        handleCalculateTotal();
    };

    const handleCalculateTotal = () => {
        setFormData((prevFormData) => {
            let subTotal = 0;

            prevFormData.items.forEach((item) => {
                subTotal +=
                    parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
            });

            const taxAmount = parseFloat(
                subTotal * (prevFormData.taxRate / 100)
            ).toFixed(2);
            const discountAmount = parseFloat(
                subTotal * (prevFormData.discountRate / 100)
            ).toFixed(2);
            const total = (
                subTotal -
                parseFloat(discountAmount) +
                parseFloat(taxAmount)
            ).toFixed(2);

            return {
                ...prevFormData,
                subTotal: parseFloat(subTotal).toFixed(2),
                taxAmount,
                discountAmount,
                total,
            };
        });
    };

    const editField = (name, value) => {
        setFormData({ ...formData, [name]: value });
        handleCalculateTotal();
    };

    const onCurrencyChange = (selectedOption) => {
        setFormData({ ...formData, currency: selectedOption.currency });
    };

    const saveChanges = (e) => {
        e.preventDefault()
        dispatch(updateEditedInvoice({ id: formData.id || '', updatedItem: formData }))
        setModalShow(false)
    }


    return (
        <>
            <span onClick={handleShow}>
                {children}
            </span>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='p-0'
            >
                <Modal.Body>
                    <Form onSubmit={saveChanges}>
                        <Card className="p-4 p-xl-5">
                            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                                <div className="d-flex flex-column">
                                    <div className="d-flex flex-column">
                                        <div className="mb-2">
                                            <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                                            <span className="current-date">{formData.currentDate || ""}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center">
                                        <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                                        <Form.Control
                                            type="date"
                                            value={formData.dateOfIssue || ""}
                                            name="dateOfIssue"
                                            onChange={(e) => editField(e.target.name, e.target.value)}
                                            style={{ maxWidth: "150px" }}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                    <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                                    <Form.Control
                                        type="number"
                                        value={formData.invoiceNumber || ""}
                                        name="invoiceNumber"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        min="1"
                                        readOnly
                                        style={{ maxWidth: "70px" }}
                                        required
                                    />
                                </div>
                            </div>
                            <hr className="my-4" />
                            <Row className="mb-5">
                                <Col>
                                    <Form.Label className="fw-bold">Bill to:</Form.Label>
                                    <Form.Control
                                        placeholder="Who is this invoice to?"
                                        rows={3}
                                        value={formData.billTo || ""}
                                        type="text"
                                        name="billTo"
                                        className="my-2"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        autoComplete="name"
                                        required
                                    />
                                    <Form.Control
                                        placeholder="Email address"
                                        value={formData.billToEmail || ""}
                                        type="email"
                                        name="billToEmail"
                                        className="my-2"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        autoComplete="email"
                                        required
                                    />
                                    <Form.Control
                                        placeholder="Billing address"
                                        value={formData.billToAddress || ""}
                                        type="text"
                                        name="billToAddress"
                                        className="my-2"
                                        autoComplete="address"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="fw-bold">Bill from:</Form.Label>
                                    <Form.Control
                                        placeholder="Who is this invoice from?"
                                        rows={3}
                                        value={formData.billFrom || ""}
                                        type="text"
                                        name="billFrom"
                                        className="my-2"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        autoComplete="name"
                                        required
                                    />
                                    <Form.Control
                                        placeholder="Email address"
                                        value={formData.billFromEmail || ""}
                                        type="email"
                                        name="billFromEmail"
                                        className="my-2"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        autoComplete="email"
                                        required
                                    />
                                    <Form.Control
                                        placeholder="Billing address"
                                        value={formData.billFromAddress || ""}
                                        type="text"
                                        name="billFromAddress"
                                        className="my-2"
                                        autoComplete="address"
                                        onChange={(e) => editField(e.target.name, e.target.value)}
                                        required
                                    />
                                </Col>
                            </Row>
                            <InvoiceItem
                                onItemizedItemEdit={onItemizedItemEdit}
                                onRowAdd={handleAddEvent}
                                onRowDel={handleRowDel}
                                currency={formData.currency || ""}
                                items={formData.items || ""}
                            />
                            <Row className='justify-content-end'>
                                <Col lg={7} md={8} className=''>
                                    <Form.Group className="mb-1 d-flex gap-2 align-items-center">
                                        <Form.Label className="fw-bold">Currency:</Form.Label>
                                        <Form.Select
                                            onChange={(event) =>
                                                onCurrencyChange({ currency: event.target.value })
                                            }
                                            className="btn btn-light my-1 w-80 "
                                            aria-label="Change Currency"
                                        >
                                            <option value="$">USD (United States Dollar)</option>
                                            <option value="£">GBP (British Pound Sterling)</option>
                                            <option value="¥">JPY (Japanese Yen)</option>
                                            <option value="$">CAD (Canadian Dollar)</option>
                                            <option value="$">AUD (Australian Dollar)</option>
                                            <option value="$">SGD (Singapore Dollar)</option>
                                            <option value="¥">CNY (Chinese Renminbi)</option>
                                            <option value="₿">BTC (Bitcoin)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='justify-content-end'>
                                <Col className='d-flex gap-1' lg={4}>
                                    <Form.Group className="my-1 d-flex gap-2 align-items-center">
                                        <Form.Label className="fw-bold w-50 ">Tax rate:</Form.Label>
                                        <InputGroup className="my-1 flex-nowrap w-100 ">
                                            <Form.Control
                                                name="taxRate"
                                                type="number"
                                                value={formData.taxRate}
                                                onChange={(e) => editField(e.target.name, e.target.value)}
                                                className="bg-white border "
                                                placeholder="0.0"
                                                min="0.00"
                                                step="0.01"
                                                max="100.00"
                                            />
                                            <InputGroup.Text className="bg-light fw-bold text-secondary small">
                                                %
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col lg={5} md={8}>
                                    <Form.Group className="my-1 d-flex gap-2 align-items-center">
                                        <Form.Label className="fw-bold w-50">Discount rate:</Form.Label>
                                        <InputGroup className="my-1 flex-nowrap sm-w-100">
                                            <Form.Control
                                                name="discountRate"
                                                type="number"
                                                value={formData.discountRate}
                                                onChange={(e) => editField(e.target.name, e.target.value)}
                                                className="bg-white border"
                                                placeholder="0.0"
                                                min="0.00"
                                                step="0.01"
                                                max="100.00"
                                            />
                                            <InputGroup.Text className="bg-light fw-bold text-secondary small">
                                                %
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-4 justify-content-end">
                                <Col lg={6}>
                                    <div className="d-flex flex-row align-items-start justify-content-between">
                                        <span className="fw-bold">Subtotal:</span>
                                        <span>
                                            {formData.currency || 0}
                                            {formData.subTotal || 0}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                        <span className="fw-bold">Discount:</span>
                                        <span>
                                            <span className="small">
                                                ({formData.discountRate || 0}%)
                                            </span>
                                            {formData.currency}
                                            {formData.discountAmount || 0}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                        <span className="fw-bold">Tax:</span>
                                        <span>
                                            <span className="small">({formData.taxRate || 0}%)</span>
                                            {formData.currency}
                                            {formData.taxAmount || 0}
                                        </span>
                                    </div>
                                    <hr />
                                    <div
                                        className="d-flex flex-row align-items-start justify-content-between"
                                        style={{ fontSize: "1.125rem" }}
                                    >
                                        <span className="fw-bold">Total:</span>
                                        <span className="fw-bold">
                                            {formData.currency}
                                            {formData.total || 0}
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                            <hr className="my-4" />
                            <Form.Label className="fw-bold">Notes:</Form.Label>
                            <Form.Control
                                placeholder="Thanks for your business!"
                                name="notes"
                                value={formData.notes || ""}
                                onChange={(e) => editField(e.target.name, e.target.value)}
                                as="textarea"
                                className="my-2"
                                rows={1}
                            />
                            <div className='d-flex flex-row gap-4 align-items-end w-100  m-auto border-1 border-danger'>
                                <Button onClick={handleHide} variant='outline' className=' border-1 border-danger py-2 px-4'>Cancle</Button>
                                <Button className='px-4' type='submit'>Save</Button>
                            </div>
                        </Card>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default BulkEditModal