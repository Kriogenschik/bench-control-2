import { ProjectProps } from "../components/ProjectsList/types";

export default function getBlankProjects (projectsList: Array<ProjectProps>) {
  let newProjectsList: Array<ProjectProps> = [];
  if (projectsList && projectsList.length) {
    newProjectsList = projectsList.filter(project => (!project.lead.name || !project.ba.name || !project.pm.name));
  }
  return newProjectsList
}