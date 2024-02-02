import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProjectStaffList from "../ProjectStaffList/ProjectStaffList";
import InputAutoStaff from "../InputAutoStaff/InputAutoStaff";
import { ProjectProps, ProjectStaffProps } from "../ProjectsList/types";
import { EmployeesProps } from "../StaffList/types";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { setTime, validateTime } from "../../utils/SetTime";
import getStaffProjectsTime from "../../utils/GetStaffProjectsTime";
import { useHttp } from "../../hooks/http.hook";
import { AppDispatch } from "../../store";
import { projectCreated } from "../ProjectsList/projectsListSlice";

import "./AddProjectForm.scss";

interface AddProjectFormProps {
  closeForm: () => void;
  projectsList: Array<ProjectProps>;
}

export default function AddProjectForm({
  closeForm,
  projectsList,
}: AddProjectFormProps): JSX.Element {
  interface StateProps {
    [key: string]: any;
  }

  interface IsEmptyProps {
    [key: string]: boolean;
  }

  const [details, setDetails] = useState<StateProps>({
    projectName: "",
    leadName: "",
    leadTime: 0,
    leadMaxTime: 40,
    baName: "",
    baTime: 0,
    baMaxTime: 40,
    pmName: "",
    pmTime: 0,
    pmMaxTime: 40,
    start: "",
    end: "",
    devName: "",
    devTime: 0,
    devMaxTime: 40,
    qaName: "",
    qaTime: 0,
    qaMaxTime: 40,
  });

  const [isEmpty, setIsEmpty] = useState<IsEmptyProps>({
    name: false,
    lead: false,
    ba: false,
    pm: false,
    dev: false,
    qa: false,
    start: false,
    end: false,
  });

  const [devList, setDevList] = useState<Array<ProjectStaffProps>>([]);
  const [qaList, setQAList] = useState<Array<ProjectStaffProps>>([]);

  const [clearDev, setClearDev] = useState<boolean>(false);
  const [clearQA, setClearQA] = useState<boolean>(false);

  const staffList = useSelector(allStaffSelector) as Array<EmployeesProps>;
  const devs = staffList.filter((employ) => employ.pos.toLowerCase() === "dev");
  const qas = staffList.filter((employ) => employ.pos.toLowerCase() === "qa");
  const bas = staffList.filter((employ) => employ.pos.toLowerCase() === "ba");
  const pms = staffList.filter((employ) => employ.pos.toLowerCase() === "pm");

  const activeProjects = projectsList.filter(
    (project) => project.isActive === true
  );

  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const setStaffTime = (
    e: ChangeEvent<HTMLInputElement>,
    maxTime: number,
    role: string
  ) => {
    let time = setTime(+e.target.value, maxTime);
    setDetails({ ...details, [role + "Time"]: time });
  };

  const addStaff = (
    role: string,
    list: Array<ProjectStaffProps>,
    setList: (arr: Array<ProjectStaffProps>) => void
  ) => {
    if (details[role + "Name"] && details[role + "Time"]) {
      setIsEmpty({
        ...isEmpty,
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
          id: staffList.filter((s) => s.name === details[role + "Name"])[0]!.id,
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
    setIsEmpty({
      name: !details["projectName"],
      lead: !details["leadName"],
      ba: !details["baName"],
      pm: !details["pmName"],
      dev: !devList.length,
      qa: !qaList.length,
      start: !details["start"],
      end: !details["end"],
    });

    if (
      details["projectName"] &&
      details["leadName"] &&
      details["baName"] &&
      details["pmName"] &&
      details["start"] &&
      details["end"] &&
      devList.length &&
      qaList.length
    ) {
      const newProject = {
        name: details["projectName"],
        lead: {
          id: staffList.filter(
            (employ) => employ.name === details["leadName"]
          )[0].id,
          name: details["leadName"],
          time: details["leadTime"],
          start: details["start"],
          end: details["end"],
          billingType: "B",
        },
        ba: {
          id: staffList.filter((employ) => employ.name === details["baName"])[0]
            .id,
          name: details["baName"],
          time: details["baTime"],
          start: details["start"],
          end: details["end"],
          billingType: "B",
        },
        pm: {
          id: staffList.filter((employ) => employ.name === details["pmName"])[0]
            .id,
          name: details["pmName"],
          time: details["pmTime"],
          start: details["start"],
          end: details["end"],
          billingType: "B",
        },
        start: details["start"],
        end: details["end"],
        devs: devList,
        qas: qaList,
        isActive: true,
      };
      
      request(
        process.env.REACT_APP_PORT + `projects`,
        "POST",
        JSON.stringify(newProject)
      )
        .then((res) => dispatch(projectCreated(res)))
        .catch((err) => console.log(err));
      closeForm();
    }
  };

  const setStaff = (e: string, role: string) => {
    const staff = staffList.filter((employ) => employ.name === e)[0];
    const freeTime =
      staff.time - getStaffProjectsTime(staff.id, activeProjects);

    setDetails({
      ...details,
      [role + "Name"]: e,
      [role + "Time"]: freeTime,
      [role + "MaxTime"]: freeTime,
    });
  };

  return (
    <form
      className="tab__form form tab__form--add form-add-project"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="form__row">
        <div className="form__cell">
          <label htmlFor="project-name">Project Name:</label>
          <input
            id="project-name"
            placeholder="Project Name"
            name="project-name"
            className={isEmpty["name"] ? "form__input error" : "form__input"}
            type="text"
            value={details["projectName"]}
            onChange={(e) => {
              setDetails({ ...details, projectName: e.target.value });
            }}
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={isEmpty["lead"] ? "form__input error" : "form__input"}
            label="Leader:"
            pholder="Lead Name"
            data={staffList}
            onSelected={(e: string) => setStaff(e, "lead")}
            projects={activeProjects}
          />
          <label htmlFor="lead-time">Hour Per Week:</label>
          <input
            id="lead-time"
            name="lead-time"
            placeholder="Time"
            className="form__input"
            type="text"
            value={details["leadTime"]}
            onChange={(e) => {
              setStaffTime(e, details["leadMaxTime"], "lead");
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={isEmpty["ba"] ? "form__input error" : "form__input"}
            label="BA:"
            pholder="BA Name"
            data={bas}
            onSelected={(e: string) => setStaff(e, "ba")}
            projects={activeProjects}
          />
          <label htmlFor="ba-time">Hour Per Week:</label>
          <input
            id="ba-time"
            name="ba-time"
            placeholder="Time"
            className="form__input"
            type="text"
            value={details["baTime"]}
            onChange={(e) => {
              setStaffTime(e, details["baMaxTime"], "ba");
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={isEmpty["pm"] ? "form__input error" : "form__input"}
            label="PM:"
            pholder="PM Name"
            data={pms}
            onSelected={(e: string) => setStaff(e, "pm")}
            projects={activeProjects}
          />
          <label htmlFor="pm-time">Hour Per Week:</label>
          <input
            id="pm-time"
            name="pm-time"
            placeholder="Time"
            className="form__input"
            type="text"
            value={details["pmTime"]}
            onChange={(e) => {
              setStaffTime(e, details["pmMaxTime"], "pm");
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
        </div>
        <div className="form__cell">
          <label htmlFor="start">Start At:</label>
          <input
            id="start"
            name="start"
            className={isEmpty["start"] ? "form__input error" : "form__input"}
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
            className={isEmpty["end"] ? "form__input error" : "form__input"}
            type="date"
            value={details["end"]}
            onChange={(e) => {
              setDetails({ ...details, end: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="form__row">
        <div className="form__col">
          <div className="form__cell form__cell--list">
            <p className="form__subtitle">Project Devs List:</p>
            <ProjectStaffList staffList={devList} setStaffList={setDevList} />
          </div>
          <div className="form__cell form__cell--add">
            <p className="form__subtitle">Add Dev:</p>
            <InputAutoStaff
              classname={isEmpty["dev"] ? "form__input error" : "form__input"}
              label="Name:"
              pholder={"Dev Name"}
              data={devs}
              onSelected={(e: string) => setStaff(e, "dev")}
              currentData={devList}
              clear={clearDev}
              setClear={setClearDev}
              projects={activeProjects}
            />
            <label htmlFor="dev-time">Hour Per Week:</label>
            <input
              id="dev-time"
              name="dev-time"
              placeholder="Time"
              className="form__input"
              type="text"
              value={details["devTime"]}
              onChange={(e) => {
                setStaffTime(e, details["devMaxTime"], "dev");
              }}
              onKeyDown={(e) => {
                validateTime(e);
              }}
            />
            <button
              className="tab__btn"
              onClick={() => addStaff("dev", devList, setDevList)}
            >
              Add
            </button>
          </div>
        </div>
        <div className="form__col">
          <div className="form__cell form__cell--list">
            <p className="form__subtitle">Project QAs List:</p>
            <ProjectStaffList staffList={qaList} setStaffList={setQAList} />
          </div>
          <div className="form__cell">
            <p className="form__subtitle">Add QA:</p>
            <InputAutoStaff
              classname={isEmpty["qa"] ? "form__input error" : "form__input"}
              label="Name:"
              pholder={"QA Name"}
              data={qas}
              onSelected={(e: string) => setStaff(e, "qa")}
              currentData={qaList}
              clear={clearQA}
              setClear={setClearQA}
              projects={activeProjects}
            />

            <label htmlFor="qa-time">Hour Per Week:</label>
            <input
              id="qa-time"
              name="qa-time"
              placeholder="Time"
              className="form__input"
              type="text"
              value={details["qaTime"]}
              onChange={(e) => {
                setStaffTime(e, details["qaMaxTime"], "qa");
              }}
              onKeyDown={(e) => {
                validateTime(e);
              }}
            />
            <button
              className="tab__btn"
              onClick={() => addStaff("qa", qaList, setQAList)}
            >
              Add
            </button>
          </div>
        </div>

        <div className="form__cell form__cell--btn">
          <button className="tab__btn tab__btn--add-proj" onClick={saveProject}>
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
