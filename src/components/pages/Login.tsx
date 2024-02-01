import { useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import Spinner from "../Spinner/Spinner";
import { userSignIn } from "../UserAuth/userAuthSlice";

import "./Login.scss";

const Login = (): JSX.Element => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isError, setIsError] = useState({
    name: false,
    password: false,
  });
  const [errorMessage, setErrorMesage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const auth = getAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { request } = useHttp();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Enter") {
      e.preventDefault();
      // setTimeout(() => {
      //   handleSubmit()
      // });
      // document.removeEventListener('keydown', onKeyDown);
    } else {
      console.log("not send");
    }
  };
  document.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      // setTimeout(() => {
      //   handleSubmit()
      // });
      // document.removeEventListener('keydown', onKeyDown);
    }
  });

  const handleSubmit = () => {
    setErrorMesage("");
    setIsError({
      name: !(userName && userName.length >= 3),
      password: !(password && password.length >= 6),
    });
    if (userName.length >= 3 && password.length >= 6) {
      try {
        signInWithEmailAndPassword(auth, userName, password)
          .then((userCred) => {
            if (userCred) {
              window.sessionStorage.setItem("isAuth", "true");
              window.sessionStorage.setItem("id", userCred.user.uid);
            };
            return request(`http://localhost:5000/auth/${userCred.user.uid}`)
          })
          .then((res) =>
            dispatch(
              userSignIn({
                id: window.sessionStorage.getItem("id") || "",
                token: window.sessionStorage.getItem("token") || "",
                isAuth: !!window.sessionStorage.getItem("isAuth") || false,
                isAdmin: res.isAdmin,
                name: res.name,
              })
            )
          )
          .then(() => navigate("/"))
          .catch((error) => setErrorMesage("Wrong name or password"));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const userLoadingStatus = useSelector(
    (state: RootState) => state.user.userLoadingStatus
  );

  if (userLoadingStatus === "loading") {
    return <Spinner />;
  } else if (userLoadingStatus === "error") {
    return <h5 className="login__error-message">Loading Error...</h5>;
  }

  return (
    <div className="login">
      <form className="login__form" onSubmit={(e) => e.preventDefault()}>
        <p className="login__title"> Log In</p>
        <div className="login__row">
          <input
            className={isError.name ? "login__input error" : "login__input"}
            type="text"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <label className="login__label" htmlFor="name">
            Username
          </label>
        </div>
        <div className="login__row">
          <input
            className={isError.password ? "login__input error" : "login__input"}
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="login__label" htmlFor="password">
            Password
          </label>
          <button
            className="login__input-btn fa-solid fa-eye-slash fa-lg"
            onClick={() => setShowPassword(!showPassword)}
          ></button>
          <p className="login__error-msg">{errorMessage}</p>
        </div>
        <button
          type="submit"
          className="login__btn"
          onClick={() => handleSubmit()}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
