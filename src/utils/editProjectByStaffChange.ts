import {
  ProjectProps,
  ProjectStaffProps,
} from "../components/ProjectsList/types";
import { EmployeesProps } from "../components/StaffList/types";

export const editProjectByStaffChange = (
  projectsList: Array<ProjectProps>,
  editedStaff: EmployeesProps
) => {
  let changedProjectsList: Array<ProjectProps> = [];

  projectsList.map((project) => {
    let isProjectChanged = false;
    let changedProject = { ...project };

    if (changedProject.lead.id === editedStaff.id) {
      changedProject.lead = { ...changedProject.lead, name: editedStaff.name };
      isProjectChanged = true;
    }
    if (changedProject.ba.id === editedStaff.id) {
      changedProject.ba = { ...changedProject.ba, name: editedStaff.name };
      isProjectChanged = true;
    }
    if (changedProject.pm.id === editedStaff.id) {
      changedProject.pm = { ...changedProject.pm, name: editedStaff.name };
      isProjectChanged = true;
    }

    let changedDevsList: Array<ProjectStaffProps> = [];
    changedProject.devs.filter((dev) => {
      if (dev.id === editedStaff.id) {
        const changedDev = { ...dev, name: editedStaff.name };
        changedDevsList.push(changedDev);
        isProjectChanged = true;
      } else changedDevsList.push(dev);
    });
    changedProject.devs = [...changedDevsList];

    let changedQAsList: Array<ProjectStaffProps> = [];
    changedProject.qas.filter((qa) => {
      if (qa.id === editedStaff.id) {
        const changedQA = { ...qa, name: editedStaff.name };
        changedQAsList.push(changedQA);
        isProjectChanged = true;
      } else changedQAsList.push(qa);
    });
    changedProject.qas = [...changedQAsList];

    if (isProjectChanged) {
      changedProjectsList.push(changedProject);
    }
  });

  return changedProjectsList;
};
