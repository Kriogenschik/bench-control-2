import { useState } from "react";
import { OptionProps } from "../OptionsForm/types";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { optionsEdited } from "../OptionsForm/optionsFormSlice";
import { AppDispatch } from "../../store";

interface InputsProps {
  id: string;
  name: string;
  value: string;
  optionsList: Array<OptionProps>;
  optionsId: string;
}

export default function InputsColumn({
  id,
  name,
  value,
  optionsList,
  optionsId,
}: InputsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

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

        const newOptions = optionsList.map((option) => {
          if (option.id === id) {
            return {
              ...option,
              id: id,
              value: details["value"],
              descr: details["name"],
              label: details["value"],
            };
          } else return option;
        });
        const newOptionsList = {
          arr: [...newOptions],
        };
        request(
          process.env.REACT_APP_PORT + `options/${optionsId}`,
          "PATCH",
          JSON.stringify(newOptionsList)
        )
          .then(() => dispatch(optionsEdited({ optionsId, newOptionsList })))
          .catch((err: any) => console.log(err));
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
