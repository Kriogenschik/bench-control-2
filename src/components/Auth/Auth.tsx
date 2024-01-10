import { useState } from "react";
import "./Auth.scss";

export default function Auth() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(true);
  const userName = "UserName";

  const clickOut = (e: { target: any }) => {
    if (!e.target.closest(".auth__nav")) {
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
  return (
    <div className="auth">
      <div className="auth__wrapper">
        {isSigned && <p className="auth__welcome">Welcome, {userName}</p>}
        <button
          className="auth__btn fa-regular fa-user fa-lg"
          onClick={() => handleNavClick()}
        ></button>
        <ul className={isNavOpen ? "auth__nav" : "auth__nav hidden"}>
        {isSigned && <p className="auth__welcome--sm">Welcome, {userName}</p>}
          {!isSigned && <li className="auth__nav-item">
            <button className="auth__nav-btn">Register</button>
          </li>}
          {!isSigned && <li className="auth__nav-item">
            <button className="auth__nav-btn" onClick={() => setIsSigned(true)}>Sign In</button>
          </li>}
          {isSigned && <li className="auth__nav-item">
            <button className="auth__nav-btn" onClick={() => setIsSigned(false)}>Sign Out</button>
          </li>}
        </ul>
      </div>
    </div>
  );
}
