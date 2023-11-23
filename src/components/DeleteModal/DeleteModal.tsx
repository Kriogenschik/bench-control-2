import React from "react";

import "./DeleteModal.scss";

interface ConfirmProps {
  name: string,
  cancel: React.MouseEventHandler<HTMLButtonElement>;
  remove: React.MouseEventHandler<HTMLButtonElement>;
}

export default function DeleteModal({
  name,
  cancel,
  remove,
}: ConfirmProps): JSX.Element {

  return (
    <div className="delete-modal">
      <div className="delete-modal__backdrop"></div>
      <div className="delete-modal__body">
        <p className="delete-modal__text">
          Remove <b>{name}</b> ?
        </p>
        <div className="delete-modal__buttons">
          <button
            className="delete-modal__btn tab__btn--red"
            onClick={remove}>Remove
          </button>
          <button
            className="delete-modal__btn"
            onClick={cancel}>Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
