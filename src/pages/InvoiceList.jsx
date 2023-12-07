import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch, useSelector } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import BulkEditModal from "../components/BulkEditModal";
import { addInvoiceForEdit, removeAllEditedInvoice, removeOneEditableInvoice, selectEditInvoiceList } from "../redux/bulkEditInvoiceSlice";

var arr = [];
const InvoiceList = () => {
  const editableInvoices = useSelector(selectEditInvoiceList)
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  if (editableInvoices.length === 0) {
    arr = []
  }
  if (editableInvoices.length > 0 && invoiceList.length == 0) {
    dispatch(removeAllEditedInvoice())
    arr = []
  }
  const diselectAll = () => {
    dispatch(removeAllEditedInvoice())
    arr = []
  }
  return (
    <Row>
      <Col className="mx-auto" xs={12} md={12} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column w-100 justity-content-end">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Button variant={`danger mb-2 mb-md-4 `} style={{ display: editableInvoices.length > 0 ? 'block' : 'none' }} onClick={diselectAll}>Diselect All</Button>
                <Link to="/bulkedit">
                  <Button variant={`secondary mb-2 mb-md-4 `} style={{ display: editableInvoices.length > 0 ? 'block' : 'none' }}>Edit Invoices</Button>
                </Link>
                <Link to="/create">
                  <Button variant={`primary mb-2 mb-md-4`}>Create Invoice</Button>
                </Link>
                <div className="d-none d-lg-flex gap-2 ">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>
                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "42px",
                    }}
                  />
                </div>
              </div>
              <div className="justity-content-between d-sm-flex d-lg-none flex-row w-100 " style={{ width: "100%", justifyContent: 'space-between' }}>
                <p></p>
                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>
                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "42px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.invoiceNumber}
                      invoice={invoice}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({ invoice, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // new changes from here to
  const handleChange = (invoices) => {
    if (arr.includes(invoices.id)) {
      arr = arr.filter((el) => parseInt(el) !== parseInt(invoices.id))
      dispatch(removeOneEditableInvoice(invoices.id))
    } else {
      arr.push(invoices.id)
      dispatch(addInvoiceForEdit(invoices))
    }
  }
  // till here 

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr className="">
      <td>
        <Form.Check
          inline
          label={invoice.invoiceNumber}
          name="group1"
          onChange={() => handleChange(invoice)}
          checked={arr.includes(invoice.id)}
        />
      </td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        formdata={[invoice]}
      />
    </tr>
  );
};

export default InvoiceList;
