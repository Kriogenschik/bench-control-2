import { useSelector } from "react-redux";
import { StaffBenchListProps } from "../components/BenchTable/types";
import { ProjectProps } from "../components/ProjectsList/types";
import { EmployeesProps } from "../components/StaffList/types";
import getStaffProjectsTime from "../utils/GetStaffProjectsTime";
import { allStaffSelector } from "../components/StaffList/staffListSlice";
import { allProjectsSelector } from "../components/ProjectsList/projectsListSlice";
import { useHttp } from "./http.hook";

const useCreateBenchList = (): Array<StaffBenchListProps> => {
  // const staffs = useSelector(allStaffSelector) as Array<EmployeesProps>;
  // const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;
  let staffs: Array<EmployeesProps> = []
  const { request } = useHttp();
  request("http://localhost:3001/employees").then((res) => staffs = res);
  const projectsList = request("http://localhost:3001/projects").then((res) => console.log(res));

  let staffBenchList: Array<StaffBenchListProps> = [];
  console.log(staffs);
  console.log(projectsList);
  
  
  // if (staffs && projectsList) {

  // // staffBenchList = staffs.map(async (employ: { id: number; time: number; }) => {
  // //   const actualProjects: Array<ProjectProps> = [];
  // //   proj: for (let project of await projectsList) {
  // //     if (project.isActive) {
  // //       if (
  // //         project.lead.id === employ.id ||
  // //         project.ba.id === employ.id ||
  // //         project.pm.id === employ.id
  // //       ) {
  // //         actualProjects.push(project);
  // //       } else {
  // //         for (let dev of project.devs) {
  // //           if (dev.id === employ.id) {
  // //             actualProjects.push(project);
  // //             continue proj;
  // //           }
  // //         }
  // //         for (let qa of project.qas) {
  // //           if (qa.id === employ.id) {
  // //             actualProjects.push(project);
  // //             continue proj;
  // //           }
  // //         }
  // //       }
  // //     }
  // //   }

  // //   const freeTime =
  // //     employ.time - getStaffProjectsTime(employ.id, actualProjects);
  // //   const projectUBTime = getStaffProjectsTime(employ.id, actualProjects, "UB");

  // //   let endTime = "";
  // //   if (actualProjects.length) {
  // //     actualProjects.forEach((proj) => {
  // //       if (proj.end > endTime) {
  // //         endTime = proj.end;
  // //       }
  // //     });
  // //   } else endTime = "none";

  // //   const setColor = () => {
  // //     if (endTime === "none") {
  // //       return "grey";
  // //     }
  // //     const daysLeft = Math.round(
  // //       (+new Date(endTime) - +new Date()) / 1000 / 60 / 60 / 24
  // //     );
  // //     if (daysLeft < 0) return "grey";
  // //     else if (daysLeft < 14) return "red";
  // //     else if (daysLeft < 30) return "yellow";
  // //     else return "green";
  // //   };

  // //   return {
  // //     ...employ,
  // //     projCount: actualProjects.length,
  // //     freeTime: freeTime,
  // //     ubTime: projectUBTime,
  // //     freeAt: endTime,
  // //     color: setColor(),
  // //   };
  // // });
  // }
  return staffBenchList;
};

export default useCreateBenchList;
