import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { OptionProps } from "./types";
import OptionsInputs from "../OptionsInputs/OptionsInputs";
import { optionsEdited } from "./optionsFormSlice";
import { AppDispatch } from "../../store";

import "./OptionsForm.scss";

interface OptionsFormProps {
  optionsId: string;
  optionTitle: string;
  optionName: string;
  optionsArr: Array<OptionProps>;
}

export default function OptionsForm({
  optionsId,
  optionTitle,
  optionName,
  optionsArr,
}: OptionsFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const [addOption, setAddOption] = useState({
    value: "",
    name: "",
  });

  const [isAddOptionEmpty, setIsAddOptionEmpty] = useState({
    value: false,
    name: false,
  });

  const [isOptionShown, setIsOptionShown] = useState<boolean>(true);

  function optionRemove(id: string) {
    request(
      process.env.REACT_APP_PORT + `options/${optionsId}`,
      "DELETE",
      JSON.stringify({optionName: optionName, id: id})
    )
      .then((res) => dispatch(optionsEdited({ optionsId, res })))
      .catch((err: any) => console.log(err));
  }

  function optionAdd() {
    const newIsEmpty = {
      name: !addOption["name"],
      value: !addOption["value"],
    };
    setIsAddOptionEmpty(newIsEmpty);

    if (addOption["name"] && addOption["value"]) {
      const newOptions = {
          optionName: optionName,
          descr: addOption["name"],
          label: addOption["value"],
          value: addOption["value"],
        };

      request(
        process.env.REACT_APP_PORT + `options/${optionsId}`,
        "POST",
        JSON.stringify(newOptions)
      )
        .then((res) => dispatch(optionsEdited({ optionsId, res })))
        .catch((err: any) => console.log(err));

      setAddOption({
        value: "",
        name: "",
      });
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="tab__form tab__form--options form"
    >
      <div className="form__top">
        <button
          className={isOptionShown ? "form__btn--hide" : "form__btn--show"}
          onClick={() => setIsOptionShown(!isOptionShown)}
        >
          {optionTitle}
        </button>
      </div>
      <div className={isOptionShown ? "form__body" : "form__body hide"}>
        <div className="form__grid">
          {optionsArr.map((option) => {
            return (
              <div className="form__inputs" key={option.id}>
                {option.id ? (
                  <>
                    <OptionsInputs
                      optionsId={optionsId}
                      id={option.id}
                      name={option.descr}
                      value={option.value}
                      optionsList={optionsArr}
                    />
                    <button
                      className="tab__btn tab__btn--remove fa-solid fa-trash-can fa-lg"
                      onClick={() => optionRemove(option.id)}
                    ></button>
                  </>
                ) : (
                  <p>Wrong Data</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="form__inputs--add">
          <div className="form__inputs-column">
            <label htmlFor="new-value">Value:</label>
            <input
              name="new-value"
              id="new-value"
              placeholder="Value"
              className={
                isAddOptionEmpty["value"] ? "form__input error" : "form__input"
              }
              type="text"
              value={addOption["value"]}
              onChange={(e) =>
                setAddOption({ ...addOption, value: e.target.value })
              }
            />
          </div>
          <div className="form__inputs-column">
            <label htmlFor="new-name">Name:</label>
            <input
              name="new-name"
              id="new-name"
              placeholder="Name"
              className={
                isAddOptionEmpty["name"] ? "form__input error" : "form__input"
              }
              type="text"
              value={addOption["name"]}
              onChange={(e) =>
                setAddOption({ ...addOption, name: e.target.value })
              }
            />
          </div>
          <button className="tab__btn" onClick={optionAdd}>
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
