import { useState } from "react";
import { allStaffSelector, staffEdited } from "../StaffList/staffListSlice";
import { allOptionsSelector } from "../OptionsForm/optionsFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { setTime, validateTime } from "../../utils/SetTime";
import { OptionFullProps } from "../OptionsForm/types";
import DropdownInput from "../DropdownInput/DropdownInput";
import { useHttp } from "../../hooks/http.hook";
import { EmployeesProps } from "../StaffList/types";
import { AppDispatch, RootState } from "../../store";
import { EditProjectByStaffChange } from "../../utils/EditProjectByStaffChange";
import { projectEdited } from "../ProjectsList/projectsListSlice";
import { ProjectProps } from "../ProjectsList/types";
import Spinner from "../Spinner/Spinner";

import "./EditStaffForm.scss";

interface EditFormProps {
  id: number;
  projectsList: Array<ProjectProps>;
  closeForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface StateProps {
  [key: string]: any;
}

const EditStaffForm = ({ id, projectsList, closeForm }: EditFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const allStaff = useSelector(allStaffSelector) as Array<EmployeesProps>;

  const staff = allStaff.filter((item) => item.id === id)[0] as EmployeesProps;

  const [staffState, setStaffState] = useState<StateProps>({
    name: staff.name,
    roles: staff.pos,
    stacks: staff.stack,
    exps: staff.exp,
    speak_lvl: staff.speak,
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
        speak: staffState["speak_lvl"],
        time: staffState["time"],
      };

      request(
        process.env.REACT_APP_PORT + `staff/${id}`,
        "PUT",
        JSON.stringify(editedStaff)
      )
        .then((res) => dispatch(staffEdited({ id, res })))
        .then(() => {
          EditProjectByStaffChange(projectsList, editedStaff).forEach(
            (project) => {
              const projectId = project.id;
              request(
                process.env.REACT_APP_PORT + `projects/${projectId}`,
                "PATCH",
                JSON.stringify(project)
              )
                .then(() => dispatch(projectEdited({ projectId, project })))
                .catch((err: any) => console.log(err));
            }
          );
        })
        .catch((err: any) => console.log(err));
      closeForm(e);
    }
  };

  const staffLoadingStatus = useSelector(
    (state: RootState) => state.staff.staffLoadingStatus
  );

  const projectsLoadingStatus = useSelector(
    (state: RootState) => state.projects.projectsLoadingStatus
  );

  if (staffLoadingStatus === "loading" || projectsLoadingStatus === "loading") {
    return (
      <div className="tab__form tab__form-edit loading">
        <Spinner />
        <button
          className="tab__btn tab__btn--red"
          onClick={(e) => closeForm(e)}
        >
          X
        </button>
      </div>
    );
  } else if (
    staffLoadingStatus === "error" ||
    projectsLoadingStatus === "error"
  ) {
    return (
      <div className="tab__form tab__form-edit error">
        <h5 className="message">Loading Error...</h5>
        <button
          className="tab__btn tab__btn--red"
          onClick={(e) => closeForm(e)}
        >
          X
        </button>
      </div>
    );
  }

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
              label={option.title}
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
