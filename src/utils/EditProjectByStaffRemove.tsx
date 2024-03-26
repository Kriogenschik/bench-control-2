import {
  ProjectProps,
  ProjectStaffProps,
} from "../components/ProjectsList/types";

export const EditProjectByStaffRemove = (
  projectsList: Array<ProjectProps>,
  removedStaffId: number
) => {
  let changedProjectsList: Array<ProjectProps> = [];

  projectsList.map((project) => {
    let isProjectChanged = false;
    let changedProject = { ...project };

    if (changedProject.lead.id === removedStaffId) {
      changedProject.lead = {};
      isProjectChanged = true;
    }
    if (changedProject.ba.id === removedStaffId) {
      changedProject.ba = {};
      isProjectChanged = true;
    }
    if (changedProject.pm.id === removedStaffId) {
      changedProject.pm = {};
      isProjectChanged = true;
    }

    let changedDevsList: Array<ProjectStaffProps> = [];
    changedProject.devs.filter((dev) => {
      if (dev.id === removedStaffId) {
        isProjectChanged = true;
        return;
      } else changedDevsList.push(dev);
    });
    changedProject.devs = [...changedDevsList];

    let changedQAsList: Array<ProjectStaffProps> = [];
    changedProject.qas.filter((qa) => {
      if (qa.id === removedStaffId) {
        isProjectChanged = true;
        return;
      } else changedQAsList.push(qa);
    });
    changedProject.qas = [...changedQAsList];

    if (isProjectChanged) {
      changedProjectsList.push(changedProject);
    }
  });

  return changedProjectsList;
};
