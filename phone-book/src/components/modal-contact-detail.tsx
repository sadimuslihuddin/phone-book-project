import { useQuery } from "@apollo/client";
import React, { FC } from "react";
import { Button, Card, CardBody, CardHeader, Modal } from "reactstrap";
import { GET_CONTACT_DETAIL } from "../gqls";
import _ from "lodash";
import { capitalizeFirstLetter } from "../utils/formatter";

type ModalProps = { isOpen: any; onClose: any; id: any };

export const ModalContactDetail: FC<ModalProps> = ({ isOpen, onClose, id }) => {
  const { data } = useQuery(GET_CONTACT_DETAIL, {
    variables: {
      id: id,
    },
  });

  const contactDetail = _.get(data, "contact_by_pk");
  console.log(contactDetail);

  return (
    <Modal isOpen={isOpen} fade>
      <Card>
        <CardHeader className="d-flex">
          <h5 className="mt-2">Contact Detail</h5>
          <Button className="close ms-auto" color="" onClick={() => onClose()}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </CardHeader>
        {contactDetail && (
          <CardBody>
            <span>
              First Name: {capitalizeFirstLetter(contactDetail.first_name)}
            </span>
            <br />
            <span>
              Last Name: {capitalizeFirstLetter(contactDetail.last_name)}
            </span>
            <br />
            <span>Contact Number:</span>
            <br />
            {contactDetail.phones?.length > 0 &&
              contactDetail.phones.map((contact: any) => {
                return (
                  <div>
                    <span> - {contact.number}</span>
                  </div>
                );
              })}
          </CardBody>
        )}
      </Card>
    </Modal>
  );
};
