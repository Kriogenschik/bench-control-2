import { useSelector } from "react-redux";

import { ProjectProps } from "./types";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { EmployeesProps } from "../StaffList/types";
import ProjectCard from "../ProjectCard/ProjectCard";

import "./ProjectsList.scss";
import { allProjectsSelector } from "./projectsListSlice";

interface ProjectsListProps {
  projectEdit: (id: number) => void;
  projectDelete: (id: number, name: string) => void;
}

export default function ProjectsList({
  projectEdit,
  projectDelete,
}: ProjectsListProps) {
  const staffList = useSelector(allStaffSelector) as Array<EmployeesProps>;
  const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;
  return (
    <div className="tab__projects">
      {projectsList ? (
        projectsList.map((project) => {
          return (
            <div key={project.id}>
              {project.id ? (
                <ProjectCard
                  projectEdit={projectEdit}
                  projectDelete={projectDelete}
                  staffList={staffList}
                  projects={projectsList}
                  project={project}
                />
              ) : (
                <p>Wrong Data</p>
              )}
            </div>
          );
        })
      ) : (
        <p>There are no projects yet...</p>
      )}
    </div>
  );
}
