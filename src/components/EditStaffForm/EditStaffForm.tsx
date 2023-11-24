import { useState } from "react";
import {
  selectAll as allStaffs,
  staffEdited,
} from "../StaffList/staffListSlice";
import { selectAll as allOptions } from "../OptionsForm/optionsFormSlice";
import store from "../../store";
import { useDispatch } from "react-redux";
import { EmployeesProps } from "../../data/Employees";
import { setTime, validateTime } from "../../utils/SetTime";
import { OptionFullProps } from "../OptionsForm/types";
import DropdownInput from "../DropdownInput/DropdownInput";
import { useHttp } from "../../hooks/http.hook";

import "./EditStaffForm.scss";

interface EditFormProps {
  id: number;
  closeForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const EditStaffForm = ({
  id,
  closeForm,
}: EditFormProps): JSX.Element => {
console.log("render");

  const dispatch = useDispatch();
  const { request } = useHttp();

  const staffs = allStaffs(store.getState());
  // @ts-ignore
  const staff = staffs.filter((item) => item.id === id)[0] as EmployeesProps;

  const [staffState, setStaffState] = useState({
    name: staff.name,
    roles: staff.pos,
    stacks: staff.stack,
    exps: staff.exp,
    speaklvl: staff.speak,
    time: staff.time,
  });

  const [isEmpty, setIsEmpty] = useState({
    name: false,
    time: false,
  });

  const options = allOptions(store.getState()) as Array<OptionFullProps>;

  const saveEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newIsEmpty = {
      name: !staffState["name"],
      time: !staffState["time"],
    };
    setIsEmpty(newIsEmpty);
    if (staffState["name"] && staffState["time"]) {
      const editedStaff = {
        id: id,
        name: staffState["name"],
        pos: staffState["roles"],
        stack: staffState["stacks"],
        exp: staffState["exps"],
        speak: staffState["speaklvl"],
        time: staffState["time"],
      };

      // @ts-ignore
      request(
        `http://localhost:3001/employees/${id}`,
        "PATCH",
        // @ts-ignore
        JSON.stringify(editedStaff)
      )
        // @ts-ignore
        .then(dispatch(staffEdited({ id, editedStaff })))
        .catch((err: any) => console.log(err));
      closeForm(e);
    }
  };

  return (
    <form
      className="tab__form tab__form-edit form"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="form__cell">
        <label htmlFor="name">Name:</label>
        <input
          className={isEmpty["name"] ? "form__input error" : "form__input"}
          placeholder="Name"
          name="name"
          type="text"
          value={staffState["name"]}
          onChange={(e) => {
            setStaffState({ ...staffState, name: e.target.value });
          }}
        />
      </div>

      {options.map((option) => {
        const item = option.name.toLowerCase() as string;
        //@ts-ignore
        const value = staffState[item];
        return (
          <div className="form__cell" key={option.id}>
            <DropdownInput
              optionsList={option.arr}
              label={option.name}
              value={value}
              placeholder={"select " + option.name}
              dropdownClass="dropdown__button"
              handleChange={(e: { value: React.SetStateAction<string> }) =>
                setStaffState({ ...staffState, [item]: e.value })
              }
            />
          </div>
        );
      })}

      <div className="form__cell">
        <label htmlFor="time">Weekly Allowed Time:</label>
        <input
          name="time"
          className={isEmpty["time"] ? "form__input error" : "form__input"}
          type="text"
          value={staffState["time"]}
          onChange={(e) => {
            setStaffState({ ...staffState, time: setTime(e.target.value) });
          }}
          onKeyDown={(e) => {
            validateTime(e);
          }}
        />
      </div>

      <div className="form__cell form__cell--btns">
        <button className="tab__btn" onClick={(e) => saveEdit(e)}>
          Save
        </button>
        <button
          className="tab__btn tab__btn--red"
          onClick={(e) => closeForm(e)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditStaffForm;
