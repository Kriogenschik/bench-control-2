import React, { useState } from "react";
import DropdownInput from "../DropdownInput/DropdownInput";
import { allOptionsSelector } from "../OptionsForm/optionsFormSlice";
import { OptionFullProps } from "../OptionsForm/types";
import { EmployeesProps } from "../StaffList/types";
import { staffCreated, allStaffSelector } from "../StaffList/staffListSlice";
import { setTime, validateTime } from "../../utils/SetTime";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";

import "./AddStaffForm.scss";
import { AppDispatch } from "../../store";

interface AddStaffFormProps {
  closeForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface StateProps {
  [key: string]: any,
}
interface IsEmptyProps {
  [key: string]: boolean,
}

const AddStaffForm = ({
  closeForm,
}: AddStaffFormProps) => {
  const [details, setDetails] = useState<StateProps>({
    name: "",
    roles: "",
    stacks: "",
    exps: "",
    speak_lvl: "",
    time: 0,
  });

  const [isEmpty, setIsEmpty] = useState<IsEmptyProps>({
    name: false,
    roles: false,
    stacks: false,
    exps: false,
    speaklvl: false,
    time: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const options = useSelector(allOptionsSelector) as Array<OptionFullProps>;
  // const allStaff = useSelector(allStaffSelector) as Array<EmployeesProps>;

  const saveEmployee = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newIsEmpty = {
      name: !details["name"],
      roles: !details["roles"],
      stacks: !details["stacks"],
      exps: !details["exps"],
      speaklvl: !details["speak_lvl"],
      time: !details["time"],
    };
    setIsEmpty(newIsEmpty);

    if (
      details["name"] &&
      details["roles"] &&
      details["stacks"] &&
      details["exps"] &&
      details["speak_lvl"] &&
      details["time"]
    ) {

      const newStaff = {
        name: details["name"],
        pos: details["roles"],
        stack: details["stacks"],
        exp: details["exps"],
        speak: details["speak_lvl"],
        time: details["time"],
      };
      
      
      request(
        process.env.REACT_APP_PORT + "staff",
        "POST", 
        JSON.stringify(newStaff)
      )
        .then((res) => dispatch(staffCreated(res)))
        .catch((err) => console.log(err));
      closeForm(e);
    }
  };

  return (
    <form className="tab__form form tab__form--add" onSubmit={(e) => e.preventDefault()}>
      <div className="form__cell">
        <label htmlFor="name">Name:</label>
        <input
          placeholder="Name"
          name="name"
          id="name"
          className={isEmpty["name"] ? "form__input error" : "form__input"}
          type="text"
          value={details.name}
          onChange={(e) => {
            setDetails({ ...details, name: e.target.value });
          }}
        />
      </div>

      {options.map((option) => {
        const item = option.name.toLowerCase();
        return (
          <div className="form__cell" key={option.id}>
            <DropdownInput
              optionsList={option.arr}
              label={option.title}
              value={details[item]}
              placeholder={"select " + option.name}
              dropdownClass={
                isEmpty[item] ? "dropdown__button error" : "dropdown__button"
              }
              handleChange={(e: { value: React.SetStateAction<string> }) =>
                setDetails({ ...details, [item]: e.value })
              }
            />
          </div>
        );
      })}

      <div className="form__cell">
        <label htmlFor="time">Weekly Allowed Time:</label>
        <input
          name="time"
          id="time"
          placeholder="Time"
          className={isEmpty["time"] ? "form__input error" : "form__input"}
          type="text"
          value={details.time}
          onChange={(e) => {
            setDetails({ ...details, time: setTime(e.target.value) });
          }}
          onKeyDown={(e) => {
            validateTime(e);
          }}
        />
      </div>

      <div className="form__cell form__cell--btns">
        <button className="tab__btn" onClick={(e) => saveEmployee(e)}>
          Save
        </button>
        <button className="tab__btn tab__btn--red" onClick={closeForm}>
          Close
        </button>
      </div>
    </form>
  );
};

export default AddStaffForm;
