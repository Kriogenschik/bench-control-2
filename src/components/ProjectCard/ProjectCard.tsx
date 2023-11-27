import { useState } from "react";
import InputCheckBox from "../InputCheckbox/InputCheckbox";
import { ProjectProps } from "../ProjectsList/types";
import { EmployeesProps } from "../StaffList/types";

import "./ProjectCard.scss";

interface ProjectCardProps {
  projectEdit: (id: number) => void;
  projectDelete: (id: number) => void;
  staffList: Array<EmployeesProps>;
  projects: Array<ProjectProps>;
  project: ProjectProps;
  // setcurrentProjects: (projectsList: Array<ProjectProps>) => void;
}

export default function ProjectCard({
  projectEdit,
  projectDelete,
  staffList,
  projects,
  project,
  // setcurrentProjects,
}: ProjectCardProps) {
  const [isActiveError, setIsActiveError] = useState<boolean>(false);

  const showError = () => {
    setIsActiveError(true);
    setTimeout(() => setIsActiveError(false), 4500);
  };

  const changeActive = (project: ProjectProps, id: number, active: boolean) => {
    setIsActiveError(false);
    // if (active) {
    //   const editedProjects = projects.map((project) => {
    //     if (project.id == id) {
    //       return {
    //         ...project,
    //         isActive: !active,
    //       };
    //     } else return project;
    //   });
    //   setProjects(editedProjects);
    //   setcurrentProjects(editedProjects);
    //   return;
    // }

    // const actualProjects = projects.filter(
    //   (proj) => proj.id == id || proj.isActive == true
    // );
    // const maxLeadTime =
    //   staffList.filter((employ) => employ.id == project.lead.id)[0]?.time || 40;
    // const leadTime =
    //   maxLeadTime - getStaffProjectsTime(project.lead.id, actualProjects);

    // const maxBATime =
    //   staffList.filter((employ) => employ.id == project.ba.id)[0]?.time || 40;
    // const baTime =
    //   maxBATime - getStaffProjectsTime(project.ba.id, actualProjects);

    // const maxPMTime =
    //   staffList.filter((employ) => employ.id == project.pm.id)[0]?.time || 40;
    // const pmTime =
    //   maxPMTime - getStaffProjectsTime(project.pm.id, actualProjects);

    // let minDevTime = 0;
    // project.devs.map((dev) => {
    //   const maxDevTime =
    //     staffList.filter((employ) => employ.id == dev.id)[0]?.time || 40;
    //   const devTime = maxDevTime - getStaffProjectsTime(dev.id, actualProjects);
    //   if (minDevTime > devTime) {
    //     minDevTime = devTime;
    //   }
    // });

    // let minQATime = 0;
    // project.qas.map((qa) => {
    //   const maxQATime =
    //     staffList.filter((employ) => employ.id == qa.id)[0]?.time || 40;
    //   const qaTime = maxQATime - getStaffProjectsTime(qa.id, actualProjects);
    //   if (minQATime > qaTime) {
    //     minQATime = qaTime;
    //   }
    // });

    // if (
    //   leadTime >= 0 &&
    //   baTime >= 0 &&
    //   pmTime >= 0 &&
    //   minDevTime >= 0 &&
    //   minQATime >= 0
    // ) {
    //   const editedProjects = projects.map((project) => {
    //     if (project.id == id) {
    //       return {
    //         ...project,
    //         isActive: !active,
    //       };
    //     } else return project;
    //   });
    //   setProjects(editedProjects);
    //   setcurrentProjects(editedProjects);
    // } else showError();
  };

  const timeFormat = (time: string): string => {
    if (time !== "none") {
      const endTime = new Date(time);      
      return `${
        endTime.getDate() > 9 ? endTime.getDate() : "0" + endTime.getDate()
      }.${
        (+endTime.getMonth() + 1) > 9 ? (+endTime.getMonth() + 1) : "0" + (+endTime.getMonth() + 1)
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
          Employees don't have enough free time. Please Edit the project to make
          it Active.
        </p>
        <InputCheckBox
          classname="project__switch"
          checked={project.isActive}
          handleChange={() =>
            changeActive(project, project.id, project.isActive)
          }
          label="Active:"
        />
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
          {project.lead.name} -{" "}
          {project.lead.time}h Billable: { project.lead.billingType}
        </p>
        <p className="project__info">
          <span className="project__label">BA: </span> 
          {project.ba.name} -{" "}
          {project.ba.time}h Billable: {project.ba.billingType}
        </p>
        <p className="project__info">
          <span className="project__label">PM: </span> 
          {project.pm.name} -{" "}
          {project.pm.time}h Billable: {project.pm.billingType}
        </p>
        <p className="project__info">
          <span className="project__label">StartAt: </span>{timeFormat(project.start)}
        </p>
        <p className="project__info">
          <span className="project__label">EndAt: </span>{timeFormat(project.end)}
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
                <p className="project__list-type">Billable: {dev.billingType}</p>
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
        <div className="project__buttons">
          <button
            className="tab__btn"
            onClick={() => projectEdit(project.id)}
          >Edit</button>
          <button
            className="tab__btn tab__btn--remove fa-solid fa-trash-can fa-lg"
            onClick={() => projectDelete(project.id)}
          ></button>
        </div>
      </div>
    </div>
  );
}
