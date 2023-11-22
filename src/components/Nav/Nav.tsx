import { NavLink } from "react-router-dom";

import './Nav.scss';

const setActive = ({ isActive }: any) =>
  isActive ? "active header__tab" : "header__tab";

export function Nav() {
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
      <NavLink to="/options" className={setActive}>
        Admin
      </NavLink>
    </div>
  );
}