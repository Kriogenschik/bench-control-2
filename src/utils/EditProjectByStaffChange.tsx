import { useSelector } from "react-redux";
import { allProjectsSelector } from "../components/ProjectsList/projectsListSlice";
import { ProjectProps } from "../components/ProjectsList/types";
import { EmployeesProps } from "../components/StaffList/types";


export const EditProjectByStaffChange = (projectsList: Array<ProjectProps>, editedStaff: EmployeesProps) => {

  projectsList.map(project => {
    let isPorjectChanged = false;
    
    if(project.lead.id === editedStaff.id) {
      project.lead.name = editedStaff.name;
      isPorjectChanged = true;
    }
    if(project.ba.id === editedStaff.id) {
      project.ba.name = editedStaff.name;
      isPorjectChanged = true;
    }
    if(project.pm.id === editedStaff.id) {
      project.pm.name = editedStaff.name;
      isPorjectChanged = true;
    }
    devs: for (let dev of project.devs) {
      if (dev.id === editedStaff.id) {
        dev.name = editedStaff.name;
        isPorjectChanged = true;
        break devs;
      }
    }
    qas: for (let qa of project.qas) {
      if (qa.id === editedStaff.id) {
        qa.name = editedStaff.name;
        isPorjectChanged = true;
        break qas;
      }
    }

    if (isPorjectChanged) {
      console.log(project);
    }
  })
}