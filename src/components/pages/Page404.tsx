import { NavLink } from "react-router-dom";
import "./Page404.scss";

const Page404 = ():JSX.Element => {
  return (
    <div className="page404">
      <p className="page404__title">error</p>
      <div className="page404__banner">
        <p className="page404__banner--front">404</p>
        <p className="page404__banner--back">404</p>
      </div>
      <p className="page404__text">
        Page not found
      </p>
      <NavLink to="/login" className="page404__link">to Login Page</NavLink>
    </div>
  );
};

export default Page404;