import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";

import "./AuthMenu.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { userSignOut } from "../UserAuth/userAuthSlice";

export default function AuthMenu() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userName = useSelector(
    (state: RootState) => state.user.entities[window.localStorage.getItem("id") || ""]?.name
  );

  const isAuth = useSelector(
    (state: RootState) => state.user.entities[window.localStorage.getItem("id") || ""]?.isAuth
  );

  const clickOut = (e: { target: any }) => {
    if (!e.target.closest(".auth-menu__nav")) {
      setIsNavOpen(false);
      document.removeEventListener("click", clickOut);
    }
  };

  const handleNavClick = () => {
    if (isNavOpen) {
      setIsNavOpen(false);
    } else {
      setTimeout(() => setIsNavOpen(true));
      setTimeout(() => document.addEventListener("click", clickOut));
    }
  };

  const handleSingOut = () => {
    try {
      signOut(getAuth())
        .then(() => {
          window.localStorage.setItem("isAuth", "false");
          window.localStorage.setItem("token", "");
          window.localStorage.setItem("id", "");
          dispatch(userSignOut({id: window.localStorage.getItem("id") || "", token: "", isAuth: false }));
        })
        .then(() => navigate("/login"))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-menu">
      <div className="auth-menu__wrapper">
        {userName && <p className="auth-menu__welcome">Welcome, {userName}</p>}
        <button
          className="auth-menu__btn fa-regular fa-user fa-lg"
          onClick={() => handleNavClick()}
        ></button>
        <ul className={isNavOpen ? "auth-menu__nav" : "auth-menu__nav hidden"}>
          {userName && <p className="auth-menu__welcome--sm">Welcome, {userName}</p>}
          {isAuth ? (
            <li className="auth-menu__nav-item">
              <button
                className="auth-menu__nav-btn"
                onClick={() => handleSingOut()}
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li className="auth-menu__nav-item">
              <button
                className="auth-menu__nav-btn"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
