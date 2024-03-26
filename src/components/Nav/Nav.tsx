import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import "./Nav.scss";
import { allProjectsSelector } from "../ProjectsList/projectsListSlice";
import { ProjectProps } from "../ProjectsList/types";
import getBlankProjects from "../../utils/getBlankProjects";
import { useContext, useEffect, useState } from "react";
import NavTipsContext, {
  NavTipsContextType,
} from "../../context/NavTipsProvider";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { EmployeesProps } from "../StaffList/types";
import useCreateRedStaffList from "../../hooks/useCreateRedStaffList";

const setActive = ({ isActive }: any) =>
  isActive ? "active header__tab" : "header__tab";

export function Nav() {
  const isAdmin = useSelector(
    (state: RootState) =>
      state.user.entities[window.localStorage.getItem("id") || ""]?.isAdmin
  );

  const { projectsCount, setProjectsCount, staffCount, setStaffCount } =
    useContext(NavTipsContext) as NavTipsContextType;

  const allStaff = useSelector(allStaffSelector) as Array<EmployeesProps>;
  const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;
  const projectsLoadingStatus = useSelector(
    (state: RootState) => state.projects.projectsLoadingStatus
  );

  const staffLoadingStatus = useSelector(
    (state: RootState) => state.staff.staffLoadingStatus
  );

  useEffect(() => {
    setTimeout(() => {
      if (projectsLoadingStatus === "idle") {
        setProjectsCount(getBlankProjects(projectsList)?.length || 0);
      }
    }, 500);
  }, [projectsList]);

  const staffTipCount = useCreateRedStaffList(allStaff, projectsList).length;

  useEffect(() => {
    setTimeout(() => {
      if (projectsLoadingStatus === "idle" && staffLoadingStatus === "idle") {
        setStaffCount(staffTipCount);
      }
    }, 500);
  }, [staffTipCount, projectsLoadingStatus]);

  return (
    <div className="header__menu">
      <NavLink to="/" className={setActive}>
        Bench
        {staffCount > 0 ? (
          <span className="header__tip">{staffCount}</span>
        ) : null}
      </NavLink>
      <NavLink to="/projects" className={setActive}>
        Projects
        {projectsCount > 0 ? (
          <span className="header__tip">{projectsCount}</span>
        ) : null}
      </NavLink>
      <NavLink to="/staff" className={setActive}>
        Employees
      </NavLink>
      {isAdmin && (
        <NavLink to="/options" className={setActive}>
          Admin
        </NavLink>
      )}
    </div>
  );
}
