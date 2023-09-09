import react, { SyntheticEvent, useState } from "react";
import "./styles.css";
import {
  ConfirmDeleteModalProps,
  CreateModalProps,
  EditModalProps,
  ModalProps,
} from "../../context/ModalContext";
import { TextInput } from "../textInput";

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
        {type === "create" && <CreatePersonModalContent {...props} />}
        {type === "edit" && <EditPersonModalContent {...props} />}
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

const CreatePersonModalContent = ({ onSubmit }: CreateModalProps) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const person = {
      username,
      firstName,
      lastName,
      email,
    };
    onSubmit(person);
  };

  const isValid =
    username.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    email.length > 0;

  return (
    <>
      <TextInput
        label="Username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        value={username}
      />
      <TextInput
        label="First Name"
        name="firstName"
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
        value={firstName}
      />
      <TextInput
        label="Last Name"
        name="lastName"
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
        value={lastName}
      />
      <TextInput
        label="E-Mail"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        required
        value={email}
      />
      <button
        disabled={!isValid}
        onClick={handleSubmit}
        className={`button blue`}
      >
        Create
      </button>
    </>
  );
};

const EditPersonModalContent = ({ onSubmit, person }: EditModalProps) => {
  const [username, setUsername] = useState(person.username);
  const [firstName, setFirstName] = useState(person.firstName);
  const [lastName, setLastName] = useState(person.lastName);
  const [email, setEmail] = useState(person.email);

  const handleSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const person = {
      username,
      firstName,
      lastName,
      email,
    };
    onSubmit(person);
  };

  const isValid =
    username.length > 0 &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    email.length > 0;

  return (
    <>
      <TextInput
        label="Username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        value={username}
      />
      <TextInput
        label="First Name"
        name="firstName"
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
        value={firstName}
      />
      <TextInput
        label="Last Name"
        name="lastName"
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
        value={lastName}
      />
      <TextInput
        label="E-Mail"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        required
        value={email}
      />
      <button
        disabled={!isValid}
        onClick={handleSubmit}
        className={`button blue`}
      >
        Edit
      </button>
    </>
  );
};
