import { useMutation } from "@apollo/client";
import React, { FC, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Modal,
  Input,
  FormFeedback,
} from "reactstrap";
import { ADD_CONTACT_WITH_PHONES, EDIT_CONTACT, EDIT_PHONE } from "../gqls";
import _, { update } from "lodash";
import { useForm } from "react-hook-form";
import { validator } from "../utils/validator";

type ModalProps = { isOpen: any; onClose: any; data: any; updateData: any };
type FormValues = {
  first_name: string;
  last_name: string;
  phones: Array<any>;
};

export const ModalAddContact: FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  updateData,
}) => {
  const [number, setNumber] = useState(data?.phones);
  const [addContact] = useMutation(ADD_CONTACT_WITH_PHONES);
  const [editContact] = useMutation(EDIT_CONTACT);
  const [editPhones] = useMutation(EDIT_PHONE);
  const edit = data ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    let phones = [];

    for (let i = 0; i < values?.phones?.length; i++) {
      phones.push(values.phones[i]);
    }

    try {
      if (edit) {
        await editContact({
          variables: {
            id: data.id,
            _set: {
              first_name: values.first_name,
              last_name: values.last_name,
            },
          },
        });

        await _.map(phones, (phone, index) => {
          editPhones({
            variables: {
              pk_columns: {
                number: data?.phones[index]?.number,
                contact_id: data.id,
              },
              new_phone_number: phone.number,
            },
          });
        });

        updateData();
      } else {
        await addContact({
          variables: {
            first_name: values.first_name,
            last_name: values.last_name,
            phones: phones,
          },
        });
      }
      onClose();
    } catch (e) {}
  };

  const addNumber = () => {
    setNumber([...number, { number: "" }]);
  };

  return (
    <Modal isOpen={isOpen} fade>
      <Card>
        <CardHeader className="d-flex">
          <h5 className="mt-2">Contact Detail</h5>
          <Button className="close ms-auto" color="" onClick={() => onClose()}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </CardHeader>
        <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <div className="my-3">First Name</div>
          <input
            type="text"
            id="first_name"
            className="form-control my-2"
            minLength={4}
            maxLength={12}
            placeholder="John"
            defaultValue={data ? data.first_name : ""}
            {...register("first_name")}
          />
          <div className="my-3">Last Name</div>
          <input
            type="text"
            id="last_name"
            className="form-control my-2"
            minLength={3}
            maxLength={12}
            placeholder="Doe"
            defaultValue={data ? data.last_name : ""}
            {...register("last_name")}
          />
          <div className="my-3">Phone Number List</div>
          <Button color="primary" onClick={() => addNumber()}>
            Add Number <i className="bi bi-plus-lg ms-2"></i>
          </Button>
          {number &&
            number?.map((num: any, index: number) => {
              return (
                <input
                  type="text"
                  id="phones"
                  className="form-control my-3"
                  minLength={4}
                  maxLength={15}
                  defaultValue={num ? num?.number : ""}
                  {...register(`phones.${index}.number`)}
                  placeholder="+628XXXXXXXX"
                />
              );
            })}
          <br />
          <div className="text-center">
            <Button color="success" className="mt-3" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};
