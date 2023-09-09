import { PropsWithChildren, createContext, useState } from "react";
import { Modal } from "../components/modal";
import { Person } from "../pages/dashboard";

interface IModalContext {
  showModal: (modalProps: ModalProps) => void;
  hideModal: () => void;
}

export type ModalType = "confirm-delete" | "create" | "edit";

type BaseModalProps = {
  type: ModalType;
};
export type ConfirmDeleteModalProps = BaseModalProps & {
  type: "confirm-delete";
  onSubmit: () => void;
};
export type EditModalProps = BaseModalProps & {
  type: "edit";
  person: Person;
  onSubmit: (person: Person) => void;
};
export type CreateModalProps = BaseModalProps & {
  type: "create";
  onSubmit: (person: Person) => void;
};

export type ModalProps =
  | ConfirmDeleteModalProps
  | EditModalProps
  | CreateModalProps;

export const ModalContext = createContext<IModalContext>({
  showModal: () => {},
  hideModal: () => {},
});

export const ModalContextProvider = ({ children }: PropsWithChildren) => {
  const defaultModal: ModalProps = {
    type: "create",
    onSubmit: () => {},
  };

  const [modal, setModal] = useState<ModalProps>(defaultModal);
  const [isShown, setIsShown] = useState<boolean>(false);

  const showModal = (modalProps: ModalProps) => {
    setModal(modalProps);
    setIsShown(true);
  };
  const hideModal = () => {
    setIsShown(false);
    setModal(defaultModal);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isShown && <Modal {...modal} hideModal={hideModal} />}
    </ModalContext.Provider>
  );
};
