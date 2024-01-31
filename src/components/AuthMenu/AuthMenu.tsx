import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";

import "./AuthMenu.scss";

export default function AuthMenu() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const userName = sessionStorage.getItem("userName");

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
          window.sessionStorage.setItem("isAuth", "false");
          window.sessionStorage.setItem("token", "");
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
        <p className="auth-menu__welcome">Welcome, {userName}</p>
        <button
          className="auth-menu__btn fa-regular fa-user fa-lg"
          onClick={() => handleNavClick()}
        ></button>
        <ul className={isNavOpen ? "auth-menu__nav" : "auth-menu__nav hidden"}>
          <p className="auth-menu__welcome--sm">Welcome, {userName}</p>
          {sessionStorage.getItem("userName") !== "true" ? (
            <li className="auth-menu__nav-item">
              <button
                className="auth-menu__nav-btn"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </li>
          ) : (
            <li className="auth-menu__nav-item">
              <button
                className="auth-menu__nav-btn"
                onClick={() => handleSingOut()}
              >
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
