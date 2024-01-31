import { useEffect, useRef, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       window.sessionStorage.setItem("isAuth", "true");
  //       user.getIdToken().then(token => window.sessionStorage.setItem("token", token));
  //     }
  //   })
  // })

    const onKeyDown = (e: KeyboardEvent) => {
      
        if(e.code === "Enter") {
          console.log("send");
          
          e.preventDefault()
          // setTimeout(() => {
          //   handleSubmit()
          // });
          // document.removeEventListener('keydown', onKeyDown);
        } else {
          console.log("not send");
          
        }
    };
    document.addEventListener('keyup', (e) => {
      if(e.code === "Enter") {
        console.log("send");
        
        e.preventDefault()
        // setTimeout(() => {
        //   handleSubmit()
        // });
        // document.removeEventListener('keydown', onKeyDown);
      } else {
        console.log(userName);
        
      }
    });

  const handleSubmit = () => {
    console.log(userName);
    console.log(password);
    
    setErrorMesage("");
    setIsError({
      name: !(userName && userName.length >= 3),
      password: !(password && password.length >= 6),
    });
    if (userName.length >= 3 && password.length >= 6) {
      //   request(
      //     process.env.REACT_APP_PORT + "login",
      //     "POST",
      //     JSON.stringify({ name: userName, password: password })
      //   )
      //     .then((res) => {
      //       sessionStorage.setItem("isAdmin", res.isAdmin);
      //       sessionStorage.setItem("userName", res.name);
      //     })
      //     .then(() => navigate("/"))
      //     .catch((err) => console.log(err));
      // }
      try {
        signInWithEmailAndPassword(auth, userName, password)
          .then((userCred) => {
            if (userCred) {
              window.sessionStorage.setItem("isAuth", "true");
            }
          })
          .then(() => navigate("/"))
          .catch((error) => setErrorMesage("Wrong name or password"));
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const handleSignOut = () => {
  //   request(process.env.REACT_APP_PORT + "login", "GET")
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  // };

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
        <button type="submit" className="login__btn" onClick={() => handleSubmit()}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
