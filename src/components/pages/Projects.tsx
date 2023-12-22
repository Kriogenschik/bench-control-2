import { useDispatch, useSelector } from "react-redux";
import ProjectsList from "../ProjectsList/ProjectsList";
import { ProjectProps } from "../ProjectsList/types";
import Spinner from "../Spinner/Spinner";
import {
  allProjectsSelector,
  fetchProjects,
  projectDeleted,
} from "../ProjectsList/projectsListSlice";
import AddProjectForm from "../AddProjectForm/AddProjectForm";
import { useCallback, useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useHttp } from "../../hooks/http.hook";
import EditProjectForm from "../EditProjectForm/EditProjectForm";
import { fetchStaff } from "../StaffList/staffListSlice";
import { fetchOptions } from "../OptionsForm/optionsFormSlice";

const Projects = () => {
  interface deleteProjectDataProps {
    id: number;
    name: string;
  }

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchOptions());
    dispatch(fetchProjects());
    // eslint-disable-next-line
  }, []);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteProjectData, setDeleteProjectData] =
    useState<deleteProjectDataProps>({
      id: 0,
      name: "",
    });
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editProjectId, setEditProjectId] = useState<number>(0);

  const { request } = useHttp();

  const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;

  const editFormToggle = (id: number) => {
    if (showEditForm) {
      setShowEditForm((showEditForm) => !showEditForm);
    }
    setTimeout(() => {
      setShowEditForm((showEditForm) => !showEditForm);
      setEditProjectId(() => id);
    }, 0);
  };

  const onDelete = useCallback(
    (id: number) => {
      request(
        // `http://localhost:3001/projects/${id}`,
        process.env.REACT_APP_PORT + `projects/${id}`,
        "DELETE"
      )
        .then(() => dispatch(projectDeleted(id)))
        .catch((err: any) => console.log(err));
      setShowDeleteModal(() => false);
    },
    // eslint-disable-next-line
    [request]
  );

  const openDeleteModal = (id: number, name: string) => {
    setDeleteProjectData({
      id: id,
      name: name,
    });
    setShowDeleteModal(() => true);
  };

  const projectsLoadingStatus = useSelector(
    (state: RootState) => state.projects.projectsLoadingStatus
  );

  if (projectsLoadingStatus === "loading") {
    return (
      <div className="tab__body">
        <Spinner />
      </div>
    );
  } else if (projectsLoadingStatus === "error") {
    return (
      <div className="tab__body">
        <h5 className="message">Loading Error...</h5>
      </div>
    );
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
      {showAddForm && (
        <AddProjectForm
          projectsList={projectsList}
          closeForm={() => setShowAddForm(false)}
        />
      )}

      <ProjectsList
        projects={projectsList}
        projectEdit={editFormToggle}
        projectDelete={openDeleteModal}
        // staffList={staff}
        // setCurrentProjects={setCurrentProjects}
      />
      {showEditForm && (
        <EditProjectForm
          id={editProjectId}
          projectsList={projectsList}
          closeForm={() => setShowEditForm(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          name={deleteProjectData.name}
          cancel={() => setShowDeleteModal(false)}
          remove={() => onDelete(deleteProjectData.id)}
        />
      )}
    </div>
  );
};

export default Projects;
