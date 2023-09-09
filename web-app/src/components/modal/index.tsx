import react from "react";
import "./styles.css";
import { ModalProps } from "../../context/ModalContext";

export const Modal = ({
  hideModal,
  type,
  onSubmit,
}: ModalProps & { hideModal: () => void }) => {
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
        {type === "confirm-delete" && (
          <p>Are you sure that you want to delete this person?</p>
        )}

        <button
          onClick={onSubmit}
          className={`button ${type === "confirm-delete" ? "red" : ""}`}
        >
          {`${type === "confirm-delete" ? "Yes" : "Submit"}`}
        </button>
      </div>
    </div>
  );
};
