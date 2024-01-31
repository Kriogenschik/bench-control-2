import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthMenu from "../AuthMenu/AuthMenu";
import { useEffect, useState } from "react";
import { Bench, Projects, Staff, Admin, Page404, Login  } from "../pages";
import { Nav } from "../Nav/Nav";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase-config";

import './App.scss';

function App() {
	const isAdmin = sessionStorage.getItem("isAdmin");
	// const isUser = sessionStorage.getItem("isAuth");
	const [isUser, setIsUser] = useState(false);

	// useEffect(() => {
	// 	if (window.sessionStorage.getItem("isAuth") === "true") {
	// 		setIsUser(true);
	// 	}
	// },[window.sessionStorage.getItem("isAuth")])

	initializeApp(firebaseConfig);
	
	useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        window.sessionStorage.setItem("isAuth", "true");
				setIsUser(true);
        user.getIdToken().then(token => window.sessionStorage.setItem("token", token));
      }
    })
  })

  return (
    <Router>
		<div className="main">
			<AuthMenu/>
			{isUser && <Nav />}
			<Routes>
				<Route path="/login" element={<Login />} />
				{isUser && <Route path="/" element={<Bench />} />}
				{isUser && <Route path="/projects" element={<Projects />} />}
				{isUser && <Route path="/staff" element={<Staff />} />}
				{isUser && isAdmin && <Route path="/options" element={<Admin />} />}
				<Route path="*" element={<Page404 />} />
			</Routes>
		</div>
	</Router>
  );
}

export default App;
