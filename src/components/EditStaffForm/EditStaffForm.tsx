import { useState } from "react";
import { allStaffSelector, staffEdited } from "../StaffList/staffListSlice";
import { allOptionsSelector } from "../OptionsForm/optionsFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { setTime, validateTime } from "../../utils/SetTime";
import { OptionFullProps } from "../OptionsForm/types";
import DropdownInput from "../DropdownInput/DropdownInput";
import { useHttp } from "../../hooks/http.hook";
import { EmployeesProps } from "../StaffList/types";
import { AppDispatch } from "../../store";

import "./EditStaffForm.scss";

interface EditFormProps {
  id: number;
  closeForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface StateProps {
  [key: string]: any;
}

const EditStaffForm = ({ id, closeForm }: EditFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const allStaff = useSelector(allStaffSelector) as Array<EmployeesProps>;

  const staff = allStaff.filter((item) => item.id === id)[0] as EmployeesProps;

  const [staffState, setStaffState] = useState<StateProps>({
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

  const options = useSelector(allOptionsSelector) as Array<OptionFullProps>;

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

      request(
        `http://localhost:3001/employees/${id}`,
        "PATCH",
        JSON.stringify(editedStaff)
      )
        .then(() => dispatch(staffEdited({ id, editedStaff })))
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
          id="name"
          name="name"
          type="text"
          value={staffState["name"]}
          onChange={(e) => {
            setStaffState({ ...staffState, name: e.target.value });
          }}
        />
      </div>

      {options.map((option) => {
        const item = option.name.toLowerCase();
        return (
          <div className="form__cell" key={option.id}>
            <DropdownInput
              optionsList={option.arr}
              label={option.name}
              value={staffState[item]}
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
          id="time"
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
