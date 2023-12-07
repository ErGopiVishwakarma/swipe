import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Container, Table, Form } from "react-bootstrap";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeAllEditedInvoice, selectEditInvoiceList } from "../redux/bulkEditInvoiceSlice";
import BulkEditModal from "../components/BulkEditModal";
import { updateInvoice } from "../redux/invoicesSlice";
import InvoiceModal from "../components/InvoiceModal";


const EditInvoicePage = () => {
  const allEditableInvoices = useSelector(selectEditInvoiceList)
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const discard = () => {
    dispatch(removeAllEditedInvoice())
    navigate('/')
  }

  const updateAll = () => {
    allEditableInvoices.forEach((el) => {
      dispatch(updateInvoice({ id: el.id, updatedInvoice: el }))
    })
    dispatch(removeAllEditedInvoice())
    alert("Invoice updated successfuly 🥳");
    navigate('/')
  }

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Container className="p-0">
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <Table responsive className="">
              <thead>
                <tr>
                  <th>Invoice Id</th>
                  <th>Bill To</th>
                  <th>Due Date</th>
                  <th>Total Amt.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ padding: "10px" }}>
                {allEditableInvoices.map((invoice) => (
                  <tr key={invoice.id} >
                    <td className="py-5">
                      {invoice.id || ""}
                    </td>
                    <td className="fw-normal p-1 py-5">{invoice.billTo || ""}</td>
                    <td className="fw-normal py-5">{invoice.dateOfIssue || ""}</td>
                    <td className="fw-normal py-5">
                      {invoice.currency}
                      {invoice.total}
                    </td>
                    <td className="py-5">
                      <BulkEditModal id={invoice.id || ""}>
                        <Button
                          variant="secondary"
                          className="d-block px-4"
                        > Change</Button>
                      </BulkEditModal>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              onClick={updateAll}
              variant="success"
              className="d-block w-100 mb-2"
            > Update All</Button>
            <Button variant="primary" onClick={openModal} className="d-block w-100 mb-2">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              formdata={allEditableInvoices}
            />
            <Button variant="danger" type="submit" className="d-block w-100" onClick={discard}>
              Discard
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditInvoicePage;
