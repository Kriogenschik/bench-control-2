import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { Bench, Projects, Staff, Admin, Page404  } from "../pages";
import { Nav } from "../Nav/Nav";
import { fetchOptions } from "../OptionsForm/optionsFormSlice";
import { fetchStaff } from "../StaffList/staffListSlice";
import { fetchProjects } from "../ProjectsList/projectsListSlice";
import { AppDispatch } from "../../store";

import './App.scss';

function App() {
	const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    dispatch(fetchStaff());
    dispatch(fetchOptions());
    dispatch(fetchProjects());
    // eslint-disable-next-line
  }, []);
  return (
    <Router>
		<div>
			<Nav />
			<Routes>
				<Route path="/" element={<Bench />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/staff" element={<Staff />} />
				<Route path="/options" element={<Admin />} />
				<Route path="*" element={<Page404 />} />
			</Routes>
		</div>
	</Router>
  );
}

export default App;
