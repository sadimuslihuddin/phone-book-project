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

const Dashboard = () => {
  const [modalAddContact, setModalAddContact] = useState(false);
  const [modalContactDetail, setModalContactDetail] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [contactId, setContactId] = useState("");
  const [dataContact, setDataContact] = useState();

  const { data } = useQuery(GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      order_by: {
        created_at: "desc",
      },
    },
  });

  const toggleModalAddContact = () => {
    setModalAddContact(!modalAddContact);
    console.log("t");
  };

  const toggleModalContactDetail = (phone: any) => {
    setModalContactDetail(!modalContactDetail);
    setContactId(phone?.id);
    setDataContact(phone);
  };

  const toggleDelete = (id: string) => {
    setModalDelete(!modalDelete);
    setContactId(id);
  };

  const contact = _.get(data, "contact");

  console.log(contactId);
  return (
    <div>
      <Navbar style={{ borderBottom: "1px solid rgba(0,0,0,0.3)" }}>
        <NavbarBrand href="/">Phone Book App</NavbarBrand>
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
                </CardBody>
              </Card>
            );
          })}
      </Container>
      <ModalAddContact
        data={dataContact}
        isOpen={modalAddContact}
        onClose={toggleModalAddContact}></ModalAddContact>
      {contactId && (
        <ModalContactDetail
          id={contactId}
          isOpen={modalContactDetail}
          onClose={toggleModalContactDetail}
        />
      )}
      <ModalDelete id={contactId} isOpen={modalDelete} onClose={toggleDelete} />
    </div>
  );
};

export default Dashboard;
