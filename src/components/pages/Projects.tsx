import { useSelector } from "react-redux";
import ProjectsList from "../ProjectsList/ProjectsList";
import { ProjectProps } from "../ProjectsList/types";
import Spinner from "../Spinner/Spinner";
import { allProjectsSelector } from "../ProjectsList/projectsListSlice";
import AddProjectForm from "../AddProjectForm/AddProjectForm";
import { useState } from "react";
import { RootState } from "../../store";

const Projects = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;

  const editFormToggle = () => {
    console.log("edit");
  }

  const projectDeleteConfirm = () => {
    console.log("delete");
  }

  const projectsLoadingStatus = useSelector(
    (state: RootState) => state.projects.projectsLoadingStatus
  );


  if (projectsLoadingStatus === "loading") {
    return <Spinner />;
  } else if (projectsLoadingStatus === "error") {
    return <h5 className="message">Loading Error...</h5>;
  }
  

  return (
    <div className="tab__body">
      {!showAddForm && (
        <button
          className="tab__btn tab__btn--add"
          onClick={() => setShowAddForm(true)}
        >
          Add
        </button>
      )}
      {showAddForm && <AddProjectForm projectsList={projectsList} closeForm={() => setShowAddForm(false)} />}

      <ProjectsList
        projects={projectsList}
        projectEdit={editFormToggle}
        projectDelete={projectDeleteConfirm}
        // staffList={staff}
        // setCurrentProjects={setCurrentProjects}
      />
    </div>
  );
};

export default Projects;