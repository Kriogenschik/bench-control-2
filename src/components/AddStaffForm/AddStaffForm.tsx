import React, { useState } from "react";
import DropdownInput from "../DropdownInput/DropdownInput";
import { EmployeesProps } from "../../data/Employees";

import "./AddStaffForm.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { selectAll } from "../OptionsForm/optionsFormSlice";
import store from "../../store";
import { OptionFullProps } from "../OptionsForm/types";
import { staffCreated, allStaffSelector } from "../StaffList/staffListSlice";
import { setTime, validateTime } from "../../utils/SetTime";
import { generateNewId } from "../../utils/GenerateNewId";

interface AddStaffFormProps {
  closeForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const AddStaffForm = ({
  // employeesList,
  closeForm,
}: AddStaffFormProps): JSX.Element => {
  const [details, setDetails] = useState({
    name: "",
    roles: "",
    stacks: "",
    exps: "",
    speaklvl: "",
    time: 0,
  });

  const [isEmpty, setIsEmpty] = useState({
    name: false,
    roles: false,
    stacks: false,
    exps: false,
    speaklvl: false,
    time: false,
  });

  const dispatch = useDispatch();
  const { request } = useHttp();

  const options = selectAll(store.getState()) as Array<OptionFullProps>;
  // @ts-ignore
  const allStaff: Array<EmployeesProps> = useSelector(allStaffSelector);

  const saveEmployee = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newIsEmpty = {
      name: !details["name"],
      roles: !details["roles"],
      stacks: !details["stacks"],
      exps: !details["exps"],
      speaklvl: !details["speaklvl"],
      time: !details["time"],
    };
    setIsEmpty(newIsEmpty);

    if (
      details["name"] &&
      details["roles"] &&
      details["stacks"] &&
      details["exps"] &&
      details["speaklvl"] &&
      details["time"]
    ) {

      const newId = generateNewId(allStaff)

      const newStaff = {
        id: newId,
        name: details["name"],
        pos: details["roles"],
        stack: details["stacks"],
        exp: details["exps"],
        speak: details["speaklvl"],
        time: details["time"],
      };

      // @ts-ignore
      request(
        "http://localhost:3001/employees",
        "POST",
        // @ts-ignore
        JSON.stringify(newStaff)
      )
        // @ts-ignore
        .then(dispatch(staffCreated(newStaff)))
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
          className={isEmpty["name"] ? "form__input error" : "form__input"}
          type="text"
          value={details.name}
          onChange={(e) => {
            setDetails({ ...details, name: e.target.value });
          }}
        />
      </div>

      {options.map((option) => {
        const item = option.name.toLowerCase() as string;
        //@ts-ignore
        const value = details[item];
        //@ts-ignore
        let empty = isEmpty[item];
        return (
          <div className="form__cell" key={option.id}>
            <DropdownInput
              optionsList={option.arr}
              label={option.name}
              value={value}
              placeholder={"select " + option.name}
              dropdownClass={
                empty ? "dropdown__button error" : "dropdown__button"
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
