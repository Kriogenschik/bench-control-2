import { useState, ChangeEvent, useEffect } from "react";
import InputCheckBox from "../InputCheckbox/InputCheckbox";
import ProjectStaffEditList from "../ProjectStaffEditList/ProjectStaffEditList";
import { EmployeesProps } from "../StaffList/types";
import { ProjectProps, ProjectStaffProps } from "../ProjectsList/types";
import getStaffProjectsTime from "../../utils/getStaffProjectsTime";
import InputAutoStaff from "../InputAutoStaff/InputAutoStaff";
import { setTime, validateTime } from "../../utils/setTime";
import { useDispatch, useSelector } from "react-redux";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { useHttp } from "../../hooks/http.hook";
import { AppDispatch } from "../../store";
import { projectEdited } from "../ProjectsList/projectsListSlice";

import "./EditProjectForm.scss";

interface EditProjectFormProps {
  id: number;
  closeForm: () => void;
  projectsList: Array<ProjectProps>;
}

interface StateProps {
  [key: string]: any;
}

interface IsEmptyProps {
  [key: string]: boolean;
}

export default function EditProjectForm({
  id,
  closeForm,
  projectsList,
}: EditProjectFormProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const activeProjects = projectsList.filter(
    (project) => project.id !== id && project.isActive === true
  );
  const project: ProjectProps | undefined = projectsList.filter(
    (project) => project.id === id
  )[0];

  const staffs = useSelector(allStaffSelector) as Array<EmployeesProps>;

  const [isTimeEnough, setIsTimeEnough] = useState<IsEmptyProps>({
    lead: false,
    ba: false,
    pm: false,
  });

  const [isStaffDeleted, setIsStaffDeleted] = useState<IsEmptyProps>({
    lead: false,
    ba: false,
    pm: false,
  });

  const setStaffFreeTime = (
    name: string,
    currentTime: number,
    role: string
  ) => {
    const employ = staffs.filter((s) => s.name === name)[0];
    if (!employ) {
      setTimeout(() => setIsTimeEnough({ ...isTimeEnough, [role]: true }));
      setTimeout(() => setIsStaffDeleted({ ...isStaffDeleted, [role]: true }));
      return 0;
    } else {
      const freeTime =
        employ.time - getStaffProjectsTime(employ.id, activeProjects);
      if (freeTime < currentTime) {
        setTimeout(() => setIsTimeEnough({ ...isTimeEnough, [role]: true }));
      }
      return freeTime;
    }
  };

  const [details, setDetails] = useState<StateProps>({
    leadName: project.lead.name || "",
    leadTime: project.lead.time || "",
    leadMaxTime: 40,
    leadTypeB: project.lead.billingType === "B" ? true : false,
    baName: project.ba.name || "",
    baTime: project.ba.time || "",
    baMaxTime: 40,
    baTypeB: project.ba.billingType === "B" ? true : false,
    pmName: project.pm.name || "",
    pmTime: project.pm.time || "",
    pmMaxTime: 40,
    pmTypeB: project.pm.billingType === "B" ? true : false,
    start: project.start,
    end: project.end,
    devName: "",
    devTime: 40,
    devMaxTime: 40,
    qaName: "",
    qaTime: 40,
    qaMaxTime: 40,
  });

  useEffect(() => {
    setDetails({
      ...details,
      leadMaxTime: project.lead.name
        ? setStaffFreeTime(project.lead.name, project.lead.time || 40, "lead")
        : 40,
      baMaxTime: project.ba.name
        ? setStaffFreeTime(project.ba.name, project.ba.time || 40, "ba")
        : 40,
      pmMaxTime: project.pm.name
        ? setStaffFreeTime(project.pm.name, project.pm.time || 40, "pm")
        : 40,
    });
    // eslint-disable-next-line
  }, []);

  const [devList, setDevList] = useState<Array<ProjectStaffProps>>(
    project.devs
  );
  const [qaList, setQAList] = useState<Array<ProjectStaffProps>>(project.qas);

  const [clearDev, setClearDev] = useState<boolean>(false);
  const [clearQA, setClearQA] = useState<boolean>(false);

  const devs = staffs.filter((employ) => employ.pos.toLowerCase() === "dev");
  const qas = staffs.filter((employ) => employ.pos.toLowerCase() === "qa");
  const bas = staffs.filter((employ) => employ.pos.toLowerCase() === "ba");
  const pms = staffs.filter((employ) => employ.pos.toLowerCase() === "pm");

  const setNewTime = (
    e: ChangeEvent<HTMLInputElement>,
    maxTime: number,
    role: string,
    throwError?: string
  ) => {
    if (throwError) {
      setIsTimeEnough({ ...isTimeEnough, [role]: false });
    }
    const time = setTime(e.target.value, maxTime);
    setDetails({ ...details, [role + "Time"]: time });
  };

  const setStaff = (e: string, role: string) => {
    setTimeout(() => setIsStaffDeleted({ ...isStaffDeleted, [role]: false }));
    setTimeout(() => setIsTimeEnough({ ...isTimeEnough, [role]: false }));
    
    if (e === "") {
      if (role === "lead" || role === "ba" || role === "pm") {
        setDetails({
          ...details,
          [role + "Name"]: '',
          [role + "Time"]: 0,
          [role + "MaxTime"]: 40,
        });
        return;
      } else return;
    }

    const staff = staffs.filter((employ) => employ.name === e)[0];
    const freeTime =
      staff.time - getStaffProjectsTime(staff.id, activeProjects, "B");

    setDetails({
      ...details,
      [role + "Name"]: e,
      [role + "Time"]: freeTime,
      [role + "MaxTime"]: freeTime,
    });
  };

  const addStaff = (
    role: string,
    list: Array<ProjectStaffProps>,
    setList: (arr: Array<ProjectStaffProps>) => void
  ) => {
    if (details[role + "Name"] && details[role + "Time"]) {
      setIsTimeEnough({
        ...isTimeEnough,
        start: !details["start"],
        end: !details["end"],
      });
    }

    if (
      details["start"] &&
      details["end"] &&
      details[role + "Name"] &&
      details[role + "Time"]
    ) {
      const newStaffList = [
        ...list,
        {
          id: staffs.filter((s) => s.name === details[role + "Name"])[0]!.id,
          name: details[role + "Name"],
          time: details[role + "Time"],
          start: details["start"],
          end: details["end"],
          billingType: "B",
        },
      ];
      setList(newStaffList);
      setDetails({ ...details, [role + "Name"]: "", [role + "Time"]: 0 });
      if (role === "dev") setClearDev(() => true);
      if (role === "qa") setClearQA(() => true);
    }
  };

  const saveProject = () => {
    const form = document.querySelector(".form-edit");
    const errors = form ? form.querySelectorAll(".error") : [];
    if (!errors.length) {
      const editedProject: ProjectProps = {
        id: id,
        name: project.name,
        lead: details["leadName"] ? {
          id: staffs.filter((s) => s.name === details["leadName"])[0].id,
          name: details["leadName"],
          time: details["leadTime"],
          start: details["start"],
          end: details["end"],
          billingType: details["leadTypeB"] ? "B" : "UB",
        } : {},
        ba: details["baName"] ? {
          id: staffs.filter((s) => s.name === details["baName"])[0].id,
          name: details["baName"],
          time: details["baTime"],
          start: details["start"],
          end: details["end"],
          billingType: details["baTypeB"] ? "B" : "UB",
        } : {},
        pm: details["pmName"] ? {
          id: staffs.filter((s) => s.name === details["pmName"])[0].id,
          name: details["pmName"],
          time: details["pmTime"],
          start: details["start"],
          end: details["end"],
          billingType: details["pmTypeB"] ? "B" : "UB",
        }: {},
        start: details["start"],
        end: details["end"],
        devs: devList,
        qas: qaList,
        isActive: project.isActive,
      };

      request(
        process.env.REACT_APP_PORT + `projects/${id}`,
        "PUT",
        JSON.stringify(editedProject)
      )
        .then((res) => dispatch(projectEdited({ id, res })))
        .catch((err: any) => console.log(err));
      closeForm();
    }
  };

  return (
    <form
      className="tab__form form form-edit"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="form__title">{project ? project.name : ""}</h2>
      <div className="form__row">
        <div className="form__cell">
          <InputAutoStaff
            classname={
              isStaffDeleted["lead"] ? "form__input error" : "form__input"
            }
            label="Leader:"
            pholder="Lead Name"
            data={staffs}
            onSelected={(e: string) => setStaff(e, "lead")}
            defaultValue={details["leadName"]}
            projects={activeProjects}
          />
          <label htmlFor="lead-time">Hour Per Week:</label>
          <input
            id="lead-time"
            name="lead-time"
            placeholder="Time"
            className={
              isTimeEnough["lead"] ? "form__input error" : "form__input"
            }
            type="text"
            value={details["leadTime"]}
            onChange={(e) => {
              setNewTime(e, details["leadMaxTime"], "lead", "throwError");
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
          <InputCheckBox
            classname="project-edit__switch project-edit__switch--top"
            checked={details["leadTypeB"]}
            handleChange={() =>
              setDetails({ ...details, leadTypeB: !details["leadTypeB"] })
            }
            label="Billable:"
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={
              isStaffDeleted["ba"] ? "form__input error" : "form__input"
            }
            label="BA:"
            pholder="BA Name"
            data={bas}
            onSelected={(e: string) => setStaff(e, "ba")}
            defaultValue={details["baName"]}
            projects={activeProjects}
          />
          <label htmlFor="ba-time">Hour Per Week:</label>
          <input
            id="ba-time"
            name="ba-time"
            placeholder="Time"
            className={isTimeEnough["ba"] ? "form__input error" : "form__input"}
            type="text"
            value={details["baTime"]}
            onChange={(e) => {
              setNewTime(e, details["baMaxTime"], "ba", "throwError");
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
          <InputCheckBox
            classname="project-edit__switch project-edit__switch--top"
            checked={details["baTypeB"]}
            handleChange={() =>
              setDetails({ ...details, baTypeB: !details["baTypeB"] })
            }
            label="Billable:"
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={
              isStaffDeleted["pm"] ? "form__input error" : "form__input"
            }
            label="PM:"
            pholder="PM Name"
            data={pms}
            onSelected={(e: string) => setStaff(e, "pm")}
            defaultValue={details["pmName"]}
            projects={activeProjects}
          />
          <label htmlFor="pm-time">Hour Per Week:</label>
          <input
            id="pm-time"
            name="pm-time"
            placeholder="Time"
            className={isTimeEnough["pm"] ? "form__input error" : "form__input"}
            type="text"
            value={details["pmTime"]}
            onChange={(e) => {
              setNewTime(e, details["pmMaxTime"], "pm", "throwError");
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
          <InputCheckBox
            classname="project-edit__switch project-edit__switch--top"
            checked={details["pmTypeB"]}
            handleChange={() =>
              setDetails({ ...details, pmTypeB: !details["pmTypeB"] })
            }
            label="Billable:"
          />
        </div>
        <div className="form__cell">
          <label htmlFor="start">Start At:</label>
          <input
            id="start"
            name="start"
            className="form__input form__input--date"
            type="date"
            value={details["start"]}
            onChange={(e) => {
              setDetails({ ...details, start: e.target.value });
            }}
          />
          <label htmlFor="start">End At:</label>
          <input
            id="end"
            name="end"
            className="form__input form__input--date"
            type="date"
            value={details["end"]}
            onChange={(e) => {
              setDetails({ ...details, end: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="form__row form__row-edit">
        <div className="form__cell form__cell--edit-list">
          <p className="form__subtitle">Project Devs List:</p>
          <ProjectStaffEditList
            allStaffList={staffs}
            staffList={devList}
            projectID={id}
            setStaffList={setDevList}
            projectsList={activeProjects}
          />
          <p className="form__subtitle">Add Dev:</p>
          <div className="form__inputs--edit">
            <InputAutoStaff
              classname="form__input form__edit-input--name"
              label="Name:"
              pholder={"Dev Name"}
              data={devs}
              onSelected={(e: string) => setStaff(e, "dev")}
              currentData={devList}
              clear={clearDev}
              setClear={setClearDev}
              projects={activeProjects}
            />
            <div className="form__edit-input--time">
              <label htmlFor="dev-time">h/Week:</label>
              <input
                id="dev-time"
                name="dev-time"
                placeholder="Time"
                className="form__input"
                type="text"
                value={details["devTime"]}
                onChange={(e) => {
                  setNewTime(e, details["devMaxTime"], "dev");
                }}
                onKeyDown={(e) => {
                  validateTime(e);
                }}
              />
            </div>
            <button
              className="tab__btn"
              onClick={() => addStaff("dev", devList, setDevList)}
            >
              Add
            </button>
          </div>
        </div>
        <div className="form__cell form__cell--edit-list">
          <p className="form__subtitle">Project QAs List:</p>
          <ProjectStaffEditList
            allStaffList={staffs}
            staffList={qaList}
            projectID={id}
            setStaffList={setQAList}
            projectsList={activeProjects}
          />
          <p className="form__subtitle">Add QA:</p>
          <div className="form__inputs--edit">
            <InputAutoStaff
              classname="form__input form__edit-input--name"
              label="Name:"
              pholder={"QA Name"}
              data={qas}
              onSelected={(e: string) => setStaff(e, "qa")}
              currentData={qaList}
              clear={clearQA}
              setClear={setClearQA}
              projects={activeProjects}
            />
            <div className="form__edit-input--time">
              <label htmlFor="qa-time">h/Week:</label>
              <input
                id="qa-time"
                name="qa-time"
                placeholder="Time"
                className="form__input"
                type="text"
                value={details["qaTime"]}
                onChange={(e) => {
                  setNewTime(e, details["qaMaxTime"], "qa");
                }}
                onKeyDown={(e) => {
                  validateTime(e);
                }}
              />
            </div>
            <button
              className="tab__btn"
              onClick={() => addStaff("qa", qaList, setQAList)}
            >
              Add
            </button>
          </div>
        </div>
        <div className="form__cell form__cell--btn">
          <button className="tab__btn" onClick={saveProject}>
            Save
          </button>
          <button className="tab__btn tab__btn--red" onClick={closeForm}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
