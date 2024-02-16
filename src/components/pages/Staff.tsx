import { useCallback, useEffect, useState } from "react";
import DeleteModal from "../DeleteModal/DeleteModal";
import StaffList from "../StaffList/StaffList";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff, staffDeleted } from "../StaffList/staffListSlice";
import AddStaffForm from "../AddStaffForm/AddStaffForm";
import EditStaffForm from "../EditStaffForm/EditStaffForm";
import { AppDispatch, RootState } from "../../store";
import {
  allOptionsSelector,
  fetchOptions,
} from "../OptionsForm/optionsFormSlice";
import Tooltips from "../Tooltips/Tooltips";
import { OptionFullProps } from "../OptionsForm/types";
import { EditProjectByStaffRemove } from "../../utils/EditProjectByStaffRemove";
import { allProjectsSelector, projectEdited } from "../ProjectsList/projectsListSlice";
import { ProjectProps } from "../ProjectsList/types";

const Staff = (): JSX.Element => {
  interface deleteStaffDataProps {
    id: string;
    name: string;
  }

  const dispatch = useDispatch<AppDispatch>();
  const isAdmin = useSelector(
    (state: RootState) =>
      state.user.entities[window.localStorage.getItem("id") || ""]?.isAdmin
  );

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchOptions());
    // eslint-disable-next-line
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteStaffData, setDeleteStaffData] = useState<deleteStaffDataProps>({
    id: "",
    name: "",
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editStaffId, setEditStaffId] = useState<string>("");
  const [showUserTooltip, setShowUserTooltip] = useState<boolean>(false);

  const allOptions = useSelector(allOptionsSelector) as Array<OptionFullProps>;
  const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;

  const { request } = useHttp();

  const openEditForm = (id: string) => {
    if (showEditForm) {
      setShowEditForm((showEditForm) => !showEditForm);
    }
    setTimeout(() => {
      setShowEditForm((showEditForm) => !showEditForm);
      setEditStaffId(() => id);
    }, 0);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteStaffData({
      id: id,
      name: name,
    });
    setShowDeleteModal(() => true);
  };

  const onDelete = useCallback(
    (id: string) => {
      request(process.env.REACT_APP_PORT + `staffs/${id}`, "DELETE")
        .then(() => dispatch(staffDeleted(id)))
        .then(() => EditProjectByStaffRemove(projectsList, id).forEach(project => {
          const projectId = project.id;
            request(
              process.env.REACT_APP_PORT + `projects/${projectId}`,
              "PATCH",
              JSON.stringify(project)
            )
              .then(() => dispatch(projectEdited({ projectId, project })))
              .catch((err: any) => console.log(err));
          
        }))
        .catch((err: any) => console.log(err));
      setShowDeleteModal(() => false);
    },
    // eslint-disable-next-line
    [request]
  );

  return (
    <div className="tab__body">
      {!showAddForm && isAdmin && (
        <button
          className="tab__btn tab__btn--add"
          onClick={() => setShowAddForm(true)}
        >
          Add
        </button>
      )}
      { (
        <div className="tab__hint">
          <button
            className="tab__btn tab__btn--hint"
            onClick={() => setShowUserTooltip(!showUserTooltip)}
          >
            ?
          </button>
          {showUserTooltip && (
            <Tooltips
              closeTip={() => setShowUserTooltip(false)}
              btnPosition={document.documentElement.clientWidth}
              children={allOptions.map(item => {
                return (
                  <div key={item.id} className="tab__hint-col">
                    <p className="tab__hint-title">{item.name}:</p>
                    <ul>
                      {item.arr.map(option => {
                        return (
                          <li key={option.id}>
                            <span>{option.value} - {option.descr}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  
                )
              })}
            />
          )}
        </div>
      )}
      {showAddForm && <AddStaffForm closeForm={() => setShowAddForm(false)} />}
      <StaffList onEdit={openEditForm} onDelete={openDeleteModal} />
      {showEditForm && (
        <EditStaffForm
          id={editStaffId}
          closeForm={() => setShowEditForm(false)}
          // projectsList={projectsList}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          name={deleteStaffData.name}
          cancel={() => setShowDeleteModal(false)}
          remove={() => onDelete(deleteStaffData.id)}
        />
      )}
    </div>
  );
};

export default Staff;
