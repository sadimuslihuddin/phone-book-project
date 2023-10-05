import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  Input,
  Navbar,
  NavbarBrand,
} from "reactstrap";
import { GET_CONTACT_LIST } from "../../gqls";
import { css } from "@emotion/react";
import _ from "lodash";
import { capitalizeFirstLetter } from "../../utils/formatter";
import { ModalContactDetail } from "../../components/modal-contact-detail";
import { ModalAddContact } from "../../components/modal-add-contact";
import { ModalDelete } from "../../components/modal-delete-contact";
import { updatePaginatedData } from "../../utils/query";

const gparam = {
  limit: 10,
  order_by: {
    first_name: "asc",
  },
  offset: 0,
};

const Dashboard = () => {
  const [modalAddContact, setModalAddContact] = useState(false);
  const [modalContactDetail, setModalContactDetail] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [contactId, setContactId] = useState("");
  const [dataContact, setDataContact] = useState();

  console.log(dataContact);

  const { data, fetchMore } = useQuery(GET_CONTACT_LIST, {
    variables: gparam,
  });

  const toggleModalAddContact = () => {
    setModalAddContact(!modalAddContact);
  };

  const toggleModalContactDetail = (phone: any) => {
    setModalContactDetail(!modalContactDetail);
    setDataContact(phone);
    setContactId(phone?.id);
  };

  const toggleDelete = (id: string) => {
    setModalDelete(!modalDelete);
    setContactId(id);
  };

  const updateData = () => {
    fetchMore({
      variables: gparam,
      updateQuery: (previousResult, { fetchMoreResult }) =>
        updatePaginatedData("contact", previousResult, fetchMoreResult),
    });
  };

  const prevPage = () => {
    gparam.offset = gparam.offset >= 10 ? gparam.offset - 10 : gparam.offset;
    updateData();
  };

  const nextPage = () => {
    gparam.offset = gparam.offset + 10;
    updateData();
  };

  const contact = _.get(data, "contact");

  return (
    <div>
      <Navbar style={{ borderBottom: "1px solid rgba(0,0,0,0.3)" }}>
        <div></div>
        <div>
          <h4 className="my-3">Phone Book App</h4>
        </div>
        <div></div>
      </Navbar>
      <Container className="mt-5">
        <div className="text-end">
          <Button color="primary" onClick={() => toggleModalAddContact()}>
            Add Contact
            <i className="bi bi-plus-lg ms-2"></i>
          </Button>
        </div>
        {contact &&
          contact.map((phone: any) => {
            return (
              <Card className="my-3">
                <CardBody className="text-start d-flex">
                  <div>
                    <span>
                      {capitalizeFirstLetter(phone.first_name)}{" "}
                      {capitalizeFirstLetter(phone.last_name)}
                    </span>
                    <br />
                    <span>Phone Number: {phone.phones[0]?.number}</span>
                  </div>
                  <Button
                    color="danger"
                    className="ms-auto"
                    onClick={() => toggleDelete(phone.id)}>
                    Delete
                  </Button>
                  <Button
                    color="primary"
                    className="ms-3"
                    onClick={() => toggleModalContactDetail(phone)}>
                    Detail
                  </Button>
                  <ModalContactDetail
                    data={phone}
                    updateData={updateData}
                    isOpen={phone.id === contactId && modalContactDetail}
                    onClose={toggleModalContactDetail}
                  />
                </CardBody>
              </Card>
            );
          })}
        <div className="d-flex justify-content-center mb-5">
          <Button onClick={() => prevPage()}>Prev</Button>
          <Button className="ms-3" onClick={() => nextPage()}>
            Next
          </Button>
        </div>
      </Container>
      <ModalAddContact
        data={dataContact}
        updateData={updateData}
        isOpen={modalAddContact}
        onClose={toggleModalAddContact}></ModalAddContact>
      <ModalDelete id={contactId} isOpen={modalDelete} onClose={toggleDelete} />
    </div>
  );
};

export default Dashboard;
