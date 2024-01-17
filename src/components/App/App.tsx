import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Bench, Projects, Staff, Admin, Page404  } from "../pages";
import { Nav } from "../Nav/Nav";

import './App.scss';
import Auth from "../Auth/Auth";

function App() {
	const isAdmin = sessionStorage.getItem("isAdmin");
	
  return (
    <Router>
		<div>
			<Auth/>
			<Nav />
			<Routes>
				<Route path="/" element={<Bench />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/staff" element={<Staff />} />
				{isAdmin && <Route path="/options" element={<Admin />} />}
				<Route path="*" element={<Page404 />} />
			</Routes>
		</div>
	</Router>
  );
}

export default App;
