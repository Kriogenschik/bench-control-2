import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import './Nav.scss';

const setActive = ({ isActive }: any) =>
  isActive ? "active header__tab" : "header__tab";

export function Nav() {
  const isAdmin = useSelector(
    (state: RootState) => state.user.entities[window.localStorage.getItem("id") || ""]?.isAdmin
  );

  return (
    <div className="header__menu">
      <NavLink to="/" className={setActive}>
        Bench
      </NavLink>
      <NavLink to="/projects" className={setActive}>
        Projects
      </NavLink>
      <NavLink to="/staff" className={setActive}>
        Employees
      </NavLink>
      {isAdmin && <NavLink to="/options" className={setActive}>
        Admin
      </NavLink>}
    </div>
  );
}