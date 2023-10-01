import { useMutation } from "@apollo/client";
import React, { FC } from "react";
import { Button, Card, CardBody, CardHeader, Modal } from "reactstrap";
import { DELETE_CONTACT } from "../gqls";

type ModalProps = { isOpen: any; onClose: any; id: any };

export const ModalDelete: FC<ModalProps> = ({ isOpen, onClose, id }) => {
  const [deleteContact] = useMutation(DELETE_CONTACT);

  const onSubmit = async () => {
    try {
      await deleteContact({
        variables: {
          id: id,
        },
      });
      onClose();
    } catch (e) {}
  };

  return (
    <Modal isOpen={isOpen} fade>
      <Card>
        <CardHeader className="d-flex">
          <h5 className="mt-2">Delete Contact</h5>
          <Button className="close ms-auto" color="" onClick={() => onClose()}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </CardHeader>
        <CardBody>
          <span>Do you want to delete this contact?</span>
          <div className="d-flex mt-3">
            <Button
              color="primary"
              className="ms-auto"
              onClick={() => onSubmit()}>
              Yes
            </Button>
            <Button color="danger" className="ms-3" onClick={() => onClose()}>
              Cancel
            </Button>
          </div>
        </CardBody>
      </Card>
    </Modal>
  );
};
