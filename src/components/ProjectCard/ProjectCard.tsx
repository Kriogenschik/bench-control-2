import { useState } from "react";
import InputCheckBox from "../InputCheckbox/InputCheckbox";
import { ProjectProps } from "../ProjectsList/types";
import { EmployeesProps } from "../StaffList/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useHttp } from "../../hooks/http.hook";

import "./ProjectCard.scss";
import { projectEdited } from "../ProjectsList/projectsListSlice";
import getStaffProjectsTime from "../../utils/GetStaffProjectsTime";

interface ProjectCardProps {
  projectEdit: (id: number) => void;
  projectDelete: (id: number, name: string) => void;
  staffList: Array<EmployeesProps>;
  projects: Array<ProjectProps>;
  project: ProjectProps;
}

export default function ProjectCard({
  projectEdit,
  projectDelete,
  staffList,
  projects,
  project,
}: ProjectCardProps) {
  const [isActiveError, setIsActiveError] = useState<boolean>(false);

  const isAdmin = useSelector(
    (state: RootState) => state.user.entities[window.sessionStorage.getItem("id") || ""]?.isAdmin
  );

  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const showError = () => {
    setIsActiveError(true);
    setTimeout(() => setIsActiveError(false), 4500);
  };

  const checkActive = () => {
    setIsActiveError(false);

    if (project.isActive) {
      changeActive();
    } else {
      const activeProjects = projects.filter(
        (proj) => proj.id === project.id || proj.isActive === true
      );
      const lead = staffList.filter((employ) => employ.id === project.lead.id)[0];
      let maxLeadTime = -1;
      if(lead) {
        maxLeadTime = lead.time - getStaffProjectsTime(project.lead.id, activeProjects);
      }

      const ba = staffList.filter((employ) => employ.id === project.ba.id)[0];
      let maxBATime = -1;
      if(ba) {
        maxBATime = ba.time - getStaffProjectsTime(project.ba.id, activeProjects);
      }

      const pm = staffList.filter((employ) => employ.id === project.pm.id)[0];
      let maxPMTime = -1;
      if(pm) {
        maxPMTime = pm.time - getStaffProjectsTime(project.pm.id, activeProjects);
      }

      let minDevTime = 0;
      project.devs.forEach((dev) => {
        const maxDevTime =
          staffList.filter((employ) => employ.id === dev.id)[0].time -
          getStaffProjectsTime(dev.id, activeProjects);
        if (minDevTime > maxDevTime) {
          minDevTime = maxDevTime;
        }
      });

      let minQATime = 0;
      project.qas.forEach((qa) => {
        const maxQATime =
          staffList.filter((employ) => employ.id === qa.id)[0].time -
          getStaffProjectsTime(qa.id, activeProjects);
        if (minQATime > maxQATime) {
          minQATime = maxQATime;
        }
      });

      if (
        maxLeadTime >= 0 &&
        maxBATime >= 0 &&
        maxPMTime >= 0 &&
        minDevTime >= 0 &&
        minQATime >= 0
      ) {
        changeActive();
      } else showError();
    }
  };

  const changeActive = () => {
    const id = project.id;

    const editedProject = {
      ...project,
      isActive: !project.isActive,
    };
    request(
      // `http://localhost:3001/projects/${id}`,
      process.env.REACT_APP_PORT + `projects/${id}`,
      "PATCH",
      JSON.stringify(editedProject)
    )
      .then(() => dispatch(projectEdited({ id, editedProject })))
      .catch((err: any) => console.log(err));
  };

  const timeFormat = (time: string): string => {
    if (time !== "none") {
      const endTime = new Date(time);
      return `${
        endTime.getDate() > 9 ? endTime.getDate() : "0" + endTime.getDate()
      }.${
        +endTime.getMonth() + 1 > 9
          ? +endTime.getMonth() + 1
          : "0" + (+endTime.getMonth() + 1)
      }.${endTime.getFullYear()}`;
    }
    return "none";
  };

  return (
    <div
      className={
        project.isActive
          ? "tab__project project active"
          : "tab__project project"
      }
    >
      <div className="project__head">
        <p className="project__title">{project.name}</p>
        <p
          className={isActiveError ? "project__error" : "project__error hidden"}
        >
          Employees don't have enough free time or was deleted. Please Edit the project to make
          it Active.
        </p>
        {isAdmin && <InputCheckBox
          classname="project__switch"
          checked={project.isActive}
          handleChange={() => checkActive()}
          label="Active:"
        />}
      </div>
      <div className="project__body">
        <p className="project__info">
          <span className="project__label">Dev Count: </span>
          {project.devs.length}
        </p>
        <p className="project__info">
          <span className="project__label">QA Count:</span>
          {project.qas.length}
        </p>
        <p className="project__info">
          <span className="project__label">Lead: </span>
          {project.lead.name} - {project.lead.time}h Billable:{" "}
          {project.lead.billingType}
        </p>
        <p className="project__info">
          <span className="project__label">BA: </span>
          {project.ba.name} - {project.ba.time}h Billable:{" "}
          {project.ba.billingType}
        </p>
        <p className="project__info">
          <span className="project__label">PM: </span>
          {project.pm.name} - {project.pm.time}h Billable:{" "}
          {project.pm.billingType}
        </p>
        <p className="project__info">
          <span className="project__label">StartAt: </span>
          {timeFormat(project.start)}
        </p>
        <p className="project__info">
          <span className="project__label">EndAt: </span>
          {timeFormat(project.end)}
        </p>
      </div>
      <div className="project__lists">
        <div className="project__list">
          {project.devs.map((dev) => {
            return (
              <div className="project__list-item" key={dev.id}>
                <span className="project__label">Dev:</span>
                <p className="project__list-name">{dev.name}</p>
                <p className="project__list-time">{dev.time}h</p>
                <p className="project__list-type">
                  Billable: {dev.billingType}
                </p>
              </div>
            );
          })}
        </div>
        <div className="project__list">
          {project.qas.map((qa) => {
            return (
              <div className="project__list-item" key={qa.id}>
                <span className="project__label">QA:</span>
                <p className="project__list-name">{qa.name}</p>
                <p className="project__list-time">{qa.time}h</p>
                <p className="project__list-type">Billable: {qa.billingType}</p>
              </div>
            );
          })}
        </div>
        {isAdmin && <div className="project__buttons">
          <button className="tab__btn" onClick={() => projectEdit(project.id)}>
            Edit
          </button>
          <button
            className="tab__btn tab__btn--remove fa-solid fa-trash-can fa-lg"
            onClick={() => projectDelete(project.id, project.name)}
          ></button>
        </div>}
      </div>
    </div>
  );
}
