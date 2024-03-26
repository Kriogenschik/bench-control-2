import { StaffBenchListProps } from "../components/BenchTable/types";
import { ProjectProps } from "../components/ProjectsList/types";
import { EmployeesProps } from "../components/StaffList/types";
import getStaffProjectsTime from "../utils/getStaffProjectsTime";

const useCreateBenchList = (
  staffs: Array<EmployeesProps>,
  projectsList: Array<ProjectProps>
): Array<StaffBenchListProps> => {
  let staffBenchList: Array<StaffBenchListProps> = [];
  if (staffs && projectsList) {
    staffBenchList = staffs.map((employ) => {
      const actualProjects: Array<ProjectProps> = [];
      proj: for (let project of projectsList) {
        if (project.isActive) {
          if (
            project.lead.id === employ.id ||
            project.ba.id === employ.id ||
            project.pm.id === employ.id
          ) {
            actualProjects.push(project);
          } else {
            for (let dev of project.devs) {
              if (dev.id === employ.id) {
                actualProjects.push(project);
                continue proj;
              }
            }
            for (let qa of project.qas) {
              if (qa.id === employ.id) {
                actualProjects.push(project);
                continue proj;
              }
            }
          }
        }
      }

      const freeTime =
        employ.time - getStaffProjectsTime(employ.id, actualProjects);
      const projectUBTime = getStaffProjectsTime(
        employ.id,
        actualProjects,
        "UB"
      );

      let endTime = "";
      if (actualProjects.length) {
        actualProjects.forEach((proj) => {
          if (proj.end > endTime) {
            endTime = proj.end;
          }
        });
      } else endTime = "none";

      const setColor = () => {
        if (endTime === "none") {
          return "grey";
        }
        const daysLeft = Math.round(
          (+new Date(endTime) - +new Date()) / 1000 / 60 / 60 / 24
        );
        if (daysLeft < 0) return "grey";
        else if (daysLeft < 14) return "red";
        else if (daysLeft < 30) return "yellow";
        else return "green";
      };

      return {
        ...employ,
        projCount: actualProjects.length,
        freeTime: freeTime,
        ubTime: projectUBTime,
        freeAt: endTime,
        color: setColor(),
      };
    });
  }
  return staffBenchList;
};

export default useCreateBenchList;
