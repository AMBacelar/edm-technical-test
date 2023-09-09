import react, { useState } from "react";
import "./styles.css";
import {
  ConfirmDeleteModalProps,
  ModalProps,
} from "../../context/ModalContext";

export const Modal = (props: ModalProps & { hideModal: () => void }) => {
  const { hideModal, type } = props;
  const titleMap = {
    "confirm-delete": "Confirm Delete",
    create: "Create New Person",
    edit: "Edit Person",
  };
  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <button onClick={hideModal} className="modal-close">
          &#x2715;
        </button>
        <h2>{titleMap[type]}</h2>
        <hr />
        {type === "confirm-delete" && <ConfirmDeleteModalContent {...props} />}
      </div>
    </div>
  );
};

const ConfirmDeleteModalContent = ({ onSubmit }: ConfirmDeleteModalProps) => {
  return (
    <>
      <p>Are you sure that you want to delete this person?</p>
      <button onClick={onSubmit} className={`button red`}>
        Yes
      </button>
    </>
  );
};

const CreatePersonModalContent = ({ onSubmit }: ConfirmDeleteModalProps) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      <p>Are you sure that you want to delete this person?</p>
      <button onClick={onSubmit} className={`button red`}>
        Submit
      </button>
    </>
  );
};
