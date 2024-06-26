import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchEditOptions,
} from "../OptionsForm/optionsFormSlice";
import { AppDispatch } from "../../store";

interface InputsProps {
  id: number;
  name: string;
  value: string;
  optionsId: number;
  optionsName: string;
}

export default function InputsColumn({
  id,
  name,
  value,
  optionsId,
  optionsName,
}: InputsProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [details, setDeatails] = useState({
    name: name,
    value: value,
  });

  const [isEmpty, setIsEmpty] = useState({
    name: false,
    value: false,
  });
  const [isEdit, setIsEdit] = useState<boolean>(true);

  function optionEdit() {
    if (!isEdit) {
      const newIsEmpty = {
        name: !details["name"],
        value: !details["value"],
      };
      setIsEmpty(newIsEmpty);

      if (details["name"] && details["value"]) {
        setIsEdit(!isEdit);

        dispatch(
          fetchEditOptions({
            id,
            optionsId,
            optionsName,
            name: details["name"],
            value: details["value"],
          })
        );
      }
    } else {
      setIsEdit(!isEdit);
    }
  }
  return (
    <>
      <div className="form__inputs-column">
        <label htmlFor={id + "value"}>Value:</label>
        <input
          id={id + "value"}
          name="value"
          className={isEmpty["value"] ? "form__input error" : "form__input"}
          type="text"
          readOnly={isEdit}
          value={details["value"]}
          onChange={(e) => setDeatails({ ...details, value: e.target.value })}
        />
      </div>
      <div className="form__inputs-column">
        <label htmlFor={id + "name"}>Description:</label>
        <input
          id={id + "name"}
          name="name"
          className={isEmpty["name"] ? "form__input error" : "form__input"}
          type="text"
          readOnly={isEdit}
          value={details["name"]}
          onChange={(e) => setDeatails({ ...details, name: e.target.value })}
        />
      </div>
      <button className="tab__btn tab__btn--save" onClick={(e) => optionEdit()}>
        {isEdit ? "Edit" : "Save"}
      </button>
    </>
  );
}
