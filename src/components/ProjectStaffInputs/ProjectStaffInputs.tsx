import { ChangeEvent, useEffect, useState } from "react";
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
  const [staffTime, setStaffTime] = useState<number>(staff.time);
  
  const [staffTypeB, setStaffTypeB] = useState<boolean>(
    staff.billingType === "B" ? true : false
  );
  const [isStaffDeleted, setIsStaffDeleted] = useState<boolean>(false);

  const currentStaff = allStaffList.filter((employ) => employ.id === staff.id)[0];
  let staffMaxTime = 0;
  let freeTime = 0;
  if (currentStaff) {
    setTimeout(() => setIsStaffDeleted(true));
    staffMaxTime = allStaffList.filter((employ) => employ.id === staff.id)[0].time;
    freeTime = staffMaxTime - getStaffProjectsTime(staff.id, projectsList);
  }

  const [isTimeEnough, setIsTimeEnough] = useState<boolean>(true);

  useEffect(() => {
    changeStaffTime(staff.id, staffTime);
    if (staffTime > freeTime) {
        setIsTimeEnough(false);
    }
    // eslint-disable-next-line
  }, [staffTime, isStaffDeleted]);

  const changeType = (id: number, staffTypeB: boolean) => {
    changeStaffType(id, staffTypeB);
    setStaffTypeB(!staffTypeB);
  };

  const setNewTime = (
    e: ChangeEvent<HTMLInputElement>,
    maxTime: number,
  ) => {
      setIsTimeEnough(true);
      setStaffTime(setTime(e.target.value, maxTime))
  };

  return (
    <>
      <span className={!isStaffDeleted ? "form__list-name error" : "form__list-name"}>{staff.name}</span>
      <input
        name="staff-time"
        placeholder="Time"
        className={isTimeEnough ? "form__input form__list-time" : "form__input form__list-time error"}
        type="text"
        value={staffTime}
        onChange={(e) => { setNewTime(e, freeTime) }}
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
