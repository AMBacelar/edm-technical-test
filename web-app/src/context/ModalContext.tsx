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
  onSubmit: () => void;
};
type ConfirmDeleteModalProps = BaseModalProps & {
  type: "confirm-delete";
};
type EditModalProps = BaseModalProps & {
  type: "edit";
  person: Person;
};
type CreateModalProps = BaseModalProps & {
  type: "create";
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
