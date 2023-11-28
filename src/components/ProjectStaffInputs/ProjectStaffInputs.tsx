import { useEffect, useState } from "react";
import InputCheckBox from "../InputCheckbox/InputCheckbox";
import getStaffProjectsTime from "../../utils/GetStaffProjectsTime";
import { ProjectProps, ProjectStaffProps } from "../ProjectsList/types";
import { EmployeesProps } from "../StaffList/types";
import { setTime, validateTime } from "../../utils/SetTime";

import "./ProjectStaffInputs.scss";

interface ProjectStaffInputsProps {
  staff: ProjectStaffProps;
  allStaffList: Array<EmployeesProps>,
  remove: (id: number) => void;
  changeStaffType: any;
  changeStaffTime: any;
  projectsList: Array<ProjectProps>,
}

export default function ProjectStaffInputs({
  staff,
  allStaffList,
  remove,
  changeStaffType,
  changeStaffTime,
  projectsList,
}: ProjectStaffInputsProps) {
  const [newTime, setNewTime] = useState<number>(staff.time);
  
  const [staffTypeB, setStaffTypeB] = useState<boolean>(
    staff.billingType === "B" ? true : false
  );
  
  const staffMaxTime = allStaffList.filter((employ) => employ.id === staff.id)[0]?.time || 40;
  const freeTime = staffMaxTime - getStaffProjectsTime(staff.id, projectsList);
  const [isTimeEnough, setIsTimeEnough] = useState<boolean>(true);

  useEffect(() => {
    changeStaffTime(staff.id, newTime);
    if (newTime > freeTime) {
        setIsTimeEnough(false);
    }
  }, [newTime]);

  const changeType = (id: number, staffTypeB: boolean) => {
    changeStaffType(id, staffTypeB);
    setStaffTypeB(!staffTypeB);
  };

  return (
    <>
      <span className="form__list-name">{staff.name}</span>
      <input
        name="staff-time"
        placeholder="Time"
        className={isTimeEnough ? "form__input form__list-time" : "form__input form__list-time error"}
        type="text"
        value={newTime}
        onChange={(e) => { setNewTime(setTime(e.target.value, freeTime))
          ;
        }}
        onKeyDown={(e) => {
          validateTime(e);
        }}
      />
      <InputCheckBox
        classname="project-edit__switch form__list-switch"
        checked={staffTypeB}
        handleChange={() => changeType(staff.id, staffTypeB)}
      />
      <span className="form__list-btn-cell">
        <button
          className="form__list-btn"
          onClick={(e) => remove(staff.id)}
        >X</button>
      </span>
    </>
  );
}
