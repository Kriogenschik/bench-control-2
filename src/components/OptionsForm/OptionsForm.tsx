import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { OptionProps } from "./types";
import OptionsInputs from "../OptionsInputs/OptionsInputs";
import { optionsEdited } from "./optionsFormSlice";
import { generateNewId } from "../../utils/GenerateNewId";

import "./OptionsForm.scss";

interface OptionsFormProps {
  optionsId: number;
  optionName: string;
  optionsArr: Array<OptionProps>;
}

export default function OptionsForm({
  optionsId,
  optionName,
  optionsArr,
}: OptionsFormProps) {
  const dispatch = useDispatch();
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

  function optionRemove(id: number) {
    console.log("delete");

    const newOptions = optionsArr.filter((option) => option.id !== id);
    const newOptionsList = {
      arr: [...newOptions],
    };
    // @ts-ignore
    request(
      `http://localhost:3001/options/${optionsId}`,
      "PATCH",
      // @ts-ignore
      JSON.stringify(newOptionsList)
    )
      // @ts-ignore
      .then(dispatch(optionsEdited({ optionsId, newOptionsList })))
      .catch((err: any) => console.log(err));

    // allOptions[optionName] = newOption;
    // setOptions(allOptions);

    // setOptionsList(newOption);
  }

  function optionAdd() {
    console.log("Add");
    const newIsEmpty = {
      name: !addOption["name"],
      value: !addOption["value"],
    };
    setIsAddOptionEmpty(newIsEmpty);

    if (addOption["name"] && addOption["value"]) {
      const newId = generateNewId(optionsArr);
      const newOptions = [
        ...optionsArr,
        {
          id: newId,
          descr: addOption["name"],
          label: addOption["value"],
          value: addOption["value"],
        },
      ];
      const newOptionsList = {
        arr: [...newOptions],
      };
      // @ts-ignore
      request(
        `http://localhost:3001/options/${optionsId}`,
        "PATCH",
        // @ts-ignore
        JSON.stringify(newOptionsList)
      )
        // @ts-ignore
        .then(dispatch(optionsEdited({ optionsId, newOptionsList })))
        .catch((err: any) => console.log(err));

        setAddOption({
          value: "",
          name: "",
        });
    }

    // addValue ? setIsAddValueEmpty(false) : setIsAddValueEmpty(true);
    // addName ? setIsAddNameEmpty(false) : setIsAddNameEmpty(true);
    // if (addName && addValue) {

    //   let newOption = [
    //     ...optionsList,
    //     {
    //       id: newId,
    //       name: addName,
    //       label: addValue,
    //       value: addValue,
    //     },
    //   ];

    //   allOptions[optionName] = newOption;
    //   setOptions(allOptions);
    //   setOptionsList(newOption);
    //   setAddName("");
    //   setAddValue("");
    // }
  }

  // function optionSave(e: any) {
  //   let form = e.target.form;
  //   //clear errors
  //   e.target.form.name.forEach(
  //     (input: { classList: { remove: (arg0: string) => void } }) => {
  //       input.classList.remove("error");
  //     }
  //   );
  //   e.target.form.value.forEach(
  //     (input: { classList: { remove: (arg0: string) => void } }) => {
  //       input.classList.remove("error");
  //     }
  //   );

  //   let isError = false;

  //   let newOptions: Array<OptionsProps> = [];
  //   for (let i = 0; i < form.name.length; i++) {
  //     if (form.name[i].value && form.value[i].value) {
  //       let option: OptionsProps = {
  //         id: i,
  //         name: form.name[i].value,
  //         value: form.value[i].value,
  //         label: form.value[i].value,
  //       };
  //       newOptions.push(option);
  //     } else if (form.name[i].value) {
  //       form.value[i].classList.add("error");
  //       isError = true;
  //     } else {
  //       form.name[i].classList.add("error");
  //       isError = true;
  //     }
  //   }
  //   if (!isError) {
  //     allOptions[optionName] = newOptions;
  //     setOptions(allOptions);
  //   } else {
  //     return null;
  //   }
  // }

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
          {optionName}
        </button>
      </div>
      <div className={isOptionShown ? "form__body" : "form__body hide"}>
        <div className="form__grid">
          {optionsArr.map((option) => {
            return (
              <div className="form__inputs" key={option.id}>
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
              </div>
            );
          })}
        </div>
        <div className="form__inputs--add">
          <div className="form__inputs-column">
            <label htmlFor="new-value">Value:</label>
            <input
              name="new-value"
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
