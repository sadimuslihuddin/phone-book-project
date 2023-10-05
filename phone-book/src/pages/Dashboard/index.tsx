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
// import { css } from "@emotion/css";
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

  const [bookmark, setBookMark] = useState<string[]>([]);

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

  const handleBookMark = (id: string) => {
    console.log(bookmark);
    if (bookmark.includes(id)) {
      const index = bookmark.findIndex((ids) => ids === id);
      let bookmarks = bookmark;
      let removed = bookmarks.splice(index, 1);
      console.log(index, removed, bookmarks);
      setBookMark(bookmarks);
    }
    setBookMark([...bookmark, id]);
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
      <Container className="mt-5 d-flex flex-column">
        <div className="text-end">
          <Button color="primary" onClick={() => toggleModalAddContact()}>
            Add Contact
            <i className="bi bi-plus-lg ms-2"></i>
          </Button>
        </div>
        <div className="text-start mb-4" style={{ order: 1 }}>
          <h4>Favorite</h4>
          <div className="line-bottom"></div>
        </div>

        <div className="text-start" style={{ order: 3 }}>
          <h4>Contact List</h4>
          <div className="line-bottom"></div>
        </div>
        {contact &&
          contact.map((phone: any) => {
            return (
              <Card
                className={`${
                  bookmark.includes(phone.id) ? "favorite" : "non-favorite"
                } my-3`}>
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
                    color="outline"
                    className="ms-auto"
                    onClick={() => handleBookMark(phone.id)}>
                    <i
                      className={`bi bi-bookmark${
                        bookmark.includes(phone.id) ? `-fill` : ``
                      }`}></i>
                  </Button>
                  <Button
                    color="danger"
                    className="bookmark ms-3"
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
        <div
          className="d-flex justify-content-center mb-5"
          style={{ order: 6 }}>
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
      <ModalDelete
        updateData={updateData}
        id={contactId}
        isOpen={modalDelete}
        onClose={toggleDelete}
      />
    </div>
  );
};

export default Dashboard;
