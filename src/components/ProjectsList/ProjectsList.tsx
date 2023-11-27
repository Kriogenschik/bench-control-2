import { useSelector } from "react-redux";

import { ProjectProps } from "./types";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { EmployeesProps } from "../StaffList/types";
import ProjectCard from "../ProjectCard/ProjectCard";

import "./ProjectsList.scss";

interface ProjectsListProps {
  projectEdit: (id: number) => void;
  projectDelete: (id: number) => void;
  // staffList: Array<EmployeesProps>;
  projects: Array<ProjectProps>;
  // setCurrentProjects: (projects: Array<ProjectProps>) => void;
}

export default function ProjectsList({
  projectEdit,
  projectDelete,
  // staffList,
  projects,
  // setCurrentProjects,
}: ProjectsListProps) {

  const staffList = useSelector(allStaffSelector) as Array<EmployeesProps>;

  return (
    <div className="tab__projects">
      {projects ? (
        projects.map((project) => {
          return (
            <div key={project.id}>
            <ProjectCard
              projectEdit={projectEdit}
              projectDelete={projectDelete}
              staffList={staffList}
              projects={projects}
              project={project}
              // setcurrentProjects={setCurrentProjects}
            />
            </div>
          );
        })
      ) : (
        <p>There are no projects yet...</p>
      )}
    </div>
  );
}
