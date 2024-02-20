import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthMenu from "../AuthMenu/AuthMenu";
import { useEffect } from "react";
import { Bench, Projects, Staff, Admin, Page404, Login  } from "../pages";
import { Nav } from "../Nav/Nav";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUser, userUpdate } from "../UserAuth/userAuthSlice";
import Spinner from "../Spinner/Spinner";

import './App.scss';

function App() {

	initializeApp(firebaseConfig);
	
	useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        window.localStorage.setItem("isAuth", "true");
        user.getIdToken(true).then(token => {
					window.localStorage.setItem("token", token);
          const id = user.uid;
          const editedUser = {token: token} 
          dispatch(userUpdate({id: id, editedUser}))
				});
      }
    })
  })

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
    dispatch(fetchUser());
    // eslint-disable-next-line
  }, []);

	// const isAuth = useSelector(
  //   (state: RootState) => state.user.entities[window.localStorage.getItem("id") || ""]?.isAuth
  // );

	const isAuth = window.localStorage.getItem("isAuth") === "true";

	const isAdmin = useSelector(
    (state: RootState) => state.user.entities[window.localStorage.getItem("id") || ""]?.isAdmin
  );

	const userLoadingStatus = useSelector(
    (state: RootState) => state.user.userLoadingStatus
  );

  if (userLoadingStatus === "loading") {
    return <Spinner />;
  } else if (userLoadingStatus === "error") {
    return <h5 className="login__error-message">Loading Error...</h5>;
  }
	
  return (
    <Router>
		<div className="main">
			<AuthMenu/>
			{isAuth && <Nav />}
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={ isAuth ? <Bench /> : <Login />} />
				{isAuth && <Route path="/projects" element={<Projects />} />}
				{isAuth && <Route path="/staff" element={<Staff />} />}
				{isAuth && isAdmin && <Route path="/options" element={<Admin />} />}
				<Route path="*" element={<Page404 />} />
			</Routes>
		</div>
	</Router>
  );
}

export default App;
