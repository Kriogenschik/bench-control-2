import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";

import ProjectStaffList from "../ProjectStaffList/ProjectStaffList";
import InputAutoStaff from "../InputAutoStaff/InputAutoStaff";
import { ProjectProps, ProjectStaffProps } from "../ProjectsList/types";
import { EmployeesProps } from "../StaffList/types";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { validateTime } from "../../utils/SetTime";
import getStaffProjectsTime from "../../utils/GetStaffProjectsTime";

import "./AddProjectForm.scss";

interface AddProjectFormProps {
  closeForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  projectsList: Array<ProjectProps>;
}

export default function AddProjectForm({
  closeForm,
  projectsList,
}: AddProjectFormProps): JSX.Element {

  interface StateProps {
    [key: string]: any,
  }

  const [details, setDetails] = useState<StateProps>({
    projectName: "",
    leadName: "",
    leadTime: 40,
    leadMaxTime: 40,
    baName: '',
    baTime: 40,
    baMaxTime: 40,
    pmName: '',
    pmTime: 40,
    pmMaxTime: 40,
    start: '',
    end: '',
    devName: '',
    devTime: 40,
    devMaxTime: 40,
    qaName: '',
    qaTime: 40,
    qaMaxTime: 40,
  })
  const [leadTime, setLeadTime] = useState<number>(40);
  const [maxLeadTime, setMaxLeadTime] = useState<number>(40);
  const [baTime, setBATime] = useState<number>(40);
  const [maxBATime, setMaxBATime] = useState<number>(40);
  const [pmTime, setPMTime] = useState<number>(40);
  const [maxPMTime, setMaxPMTime] = useState<number>(40);
  const [devTime, setDevTime] = useState<number>(40);
  const [maxDevTime, setMaxDevTime] = useState<number>(40);
  const [qaTime, setQATime] = useState<number>(40);
  const [maxQATime, setMaxQATime] = useState<number>(40);

  const [devList, setDevList] = useState<Array<ProjectStaffProps>>([]);
  const [qaList, setQAList] = useState<Array<ProjectStaffProps>>([]);

  const [isNameEmpty, setIsNameEmpty] = useState<boolean>(false);
  const [isLeadEmpty, setIsLeadEmpty] = useState<boolean>(false);
  const [isBAEmpty, setIsBAEmpty] = useState<boolean>(false);
  const [isPMEmpty, setIsPMEmpty] = useState<boolean>(false);
  const [isDevsEmpty, setIsDevsEmpty] = useState<boolean>(false);
  const [isQAsEmpty, setIsQAsEmpty] = useState<boolean>(false);
  const [isStartEmpty, setIsStartEmpty] = useState<boolean>(false);
  const [isEndEmpty, setIsEndEmpty] = useState<boolean>(false);

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

  const setTime = (
    e: ChangeEvent<HTMLInputElement>,
    maxTime: number,
    setTimeFunc: (arg0: number) => void
  ) => {
    if (+e.target.value > maxTime) {
      setTimeFunc(maxTime);
    } else if (e.target.value.length > 1) {
      setTimeFunc(+e.target.value.replace(/^0/, ""));
    } else {
      setTimeFunc(+e.target.value);
    }
  };

  const addDev = () => {
    // start ? setIsStartEmpty(false) : setIsStartEmpty(true);
    // end ? setIsEndEmpty(false) : setIsEndEmpty(true);
    // if (start && end && devName && devTime) {
    //   const newDevList = [
    //     ...devList,
    //     {
    //       id: staff.filter((s) => s.name === devName)[0]!.id,
    //       name: devName,
    //       time: devTime,
    //       start: start,
    //       end: end,
    //       billingType: "B",
    //     },
    //   ];
    //   setDevList(newDevList);
    //   setDevName("");
    //   setClearDev(() => true);
    // }
  };

  const addQA = () => {
    // start ? setIsStartEmpty(false) : setIsStartEmpty(true);
    // end ? setIsEndEmpty(false) : setIsEndEmpty(true);
    // if (start && end && qaName && qaTime) {
    //   const newQAList = [
    //     ...qaList,
    //     {
    //       id: staff.filter((s) => s.name === qaName)[0]!.id,
    //       name: qaName,
    //       time: qaTime,
    //       start: start,
    //       end: end,
    //       billingType: "B",
    //     },
    //   ];
    //   setQAList(newQAList);
    //   setQAName("");
    //   setClearQA(() => true);
    // }
  };

  const saveProject = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("save");
    console.log(details);
    
    
    // projectName ? setIsNameEmpty(false) : setIsNameEmpty(true);
    // leadName ? setIsLeadEmpty(false) : setIsLeadEmpty(true);
    // baName ? setIsBAEmpty(false) : setIsBAEmpty(true);
    // pmName ? setIsPMEmpty(false) : setIsPMEmpty(true);
    // start ? setIsStartEmpty(false) : setIsStartEmpty(true);
    // end ? setIsEndEmpty(false) : setIsEndEmpty(true);
    // devList.length ? setIsDevsEmpty(false) : setIsDevsEmpty(true);
    // qaList.length ? setIsQAsEmpty(false) : setIsQAsEmpty(true);
    // if (
    //   projectName &&
    //   leadName &&
    //   baName &&
    //   pmName &&
    //   start &&
    //   end &&
    //   devList.length &&
    //   qaList.length
    // ) {
    //   //new project ID
    //   let ids: Array<number> = [];
    //   for (let project of projectsList) {
    //     ids.push(project.id);
    //   }
    //   let newId = Math.max.apply(null, ids) + 1;
    //   // staff IDs:
    //   const leadID: number =
    //     staff.filter((employ) => employ.name === leadName)[0]?.id || 0;
    //   const baID: number =
    //     staff.filter((employ) => employ.name === baName)[0]?.id || 0;
    //   const pmID: number =
    //     staff.filter((employ) => employ.name === pmName)[0]?.id || 0;

    //   const newProjectsList: Array<ProjectProps> = [
    //     ...projectsList,
    //     {
    //       id: newId,
    //       name: projectName,
    //       lead: {
    //         id: leadID,
    //         name: leadName,
    //         time: leadTime,
    //         start: start,
    //         end: end,
    //         billingType: "B",
    //       },
    //       ba: {
    //         id: baID,
    //         name: baName,
    //         time: baTime,
    //         start: start,
    //         end: end,
    //         billingType: "B",
    //       },
    //       pm: {
    //         id: pmID,
    //         name: pmName,
    //         time: pmTime,
    //         start: start,
    //         end: end,
    //         billingType: "B",
    //       },
    //       start: start,
    //       end: end,
    //       devs: devList,
    //       qas: qaList,
    //       isActive: true,
    //     },
    //   ];
    //   setProjects(newProjectsList);
    //   setCurrentProjects(newProjectsList);
    //   closeForm(e);
    // }
  };

  const setStaff = (e: string, role: string) => {
    const staff = staffList.filter((employ) => employ.name === e)[0];
    const freeTime = staff.time - getStaffProjectsTime(staff.id, activeProjects, "B");

    setDetails({ ...details, [role + "Name"]: e, [role + "Time"]: freeTime, [role + "MaxTime"]: freeTime,})
    console.log(freeTime);
  }
  

  return (
    <form
      className="tab__form form tab__form--add form-add-project"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="form__row">
        <div className="form__cell">
          <label htmlFor="project-name">Project Name:</label>
          <input
            placeholder="Project Name"
            name="project-name"
            className={isNameEmpty ? "form__input error" : "form__input"}
            type="text"
            value={details['projectName']}
            onChange={(e) => {
              setDetails({ ...details, projectName: e.target.value });
            }}
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={isLeadEmpty ? "form__input error" : "form__input"}
            label="Leader:"
            pholder="Lead Name"
            data={staffList}
            onSelected={(e: string) => setStaff(e, "lead")}
            projects={activeProjects}
          />
          <label htmlFor="lead-time">Hour Per Week:</label>
          <input
            name="lead-time"
            placeholder="Time"
            className="form__input"
            type="text"
            value={details['leadTime']}
            onChange={(e) => {
              setTime(e, maxLeadTime, setLeadTime);
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={isBAEmpty ? "form__input error" : "form__input"}
            label="BA:"
            pholder="BA Name"
            data={bas}
            onSelected={(e: string) => setStaff(e, "ba")}
            projects={activeProjects}
          />
          <label htmlFor="ba-time">Hour Per Week:</label>
          <input
            name="ba-time"
            placeholder="Time"
            className="form__input"
            type="text"
            value={details['baTime']}
            onChange={(e) => {
              setTime(e, maxBATime, setBATime);
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
        </div>
        <div className="form__cell">
          <InputAutoStaff
            classname={isPMEmpty ? "form__input error" : "form__input"}
            label="PM:"
            pholder="PM Name"
            data={pms}
            onSelected={(e: string) => setStaff(e, "pm")}
            projects={activeProjects}
          />
          <label htmlFor="pm-time">Hour Per Week:</label>
          <input
            name="pm-time"
            placeholder="Time"
            className="form__input"
            type="text"
            value={details['pmTime']}
            onChange={(e) => {
              setTime(e, maxPMTime, setPMTime);
            }}
            onKeyDown={(e) => {
              validateTime(e);
            }}
          />
        </div>
        <div className="form__cell">
          <label htmlFor="start">Start At:</label>
          <input
            name="start"
            className={isStartEmpty ? "form__input error" : "form__input"}
            type="date"
            value={details['start']}
            onChange={(e) => {
              setDetails({ ...details, start: e.target.value });
            }}
          />
          <label htmlFor="start">End At:</label>
          <input
            name="end"
            className={isEndEmpty ? "form__input error" : "form__input"}
            type="date"
            value={details['end']}
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
              classname={isDevsEmpty ? "form__input error" : "form__input"}
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
              name="dev-time"
              placeholder="Time"
              className="form__input"
              type="text"
              value={details['devTime']}
              onChange={(e) => {
                setTime(e, maxDevTime, setDevTime);
              }}
              onKeyDown={(e) => {
                validateTime(e);
              }}
            />
            <button className="tab__btn" onClick={addDev}>
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
              classname={isQAsEmpty ? "form__input error" : "form__input"}
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
              name="qa-time"
              placeholder="Time"
              className="form__input"
              type="text"
              value={details['qaTime']}
              onChange={(e) => {
                setTime(e, maxQATime, setQATime);
              }}
              onKeyDown={(e) => {
                validateTime(e);
              }}
            />
            <button className="tab__btn" onClick={addQA}>
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
