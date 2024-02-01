import { useCallback, useEffect, useState } from "react";
import DeleteModal from "../DeleteModal/DeleteModal";
import StaffList from "../StaffList/StaffList";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch } from "react-redux";
import { fetchStaff, staffDeleted } from "../StaffList/staffListSlice";
import AddStaffForm from "../AddStaffForm/AddStaffForm";
import EditStaffForm from "../EditStaffForm/EditStaffForm";
import { AppDispatch } from "../../store";
import { fetchOptions } from "../OptionsForm/optionsFormSlice";

const Staff = ():JSX.Element => {
  interface deleteStaffDataProps {
    id: number;
    name: string;
  }

  const dispatch = useDispatch<AppDispatch>();
  const isAdmin = sessionStorage.getItem("isAdmin");

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchOptions());
    // eslint-disable-next-line
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteStaffData, setDeleteStaffData] = useState<deleteStaffDataProps>({
    id: 0,
    name: "",
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editStaffId, setEditStaffId] = useState<number>(0);

  const { request } = useHttp();

  const openEditForm = (id: number) => {
    if (showEditForm) {
      setShowEditForm((showEditForm) => !showEditForm);
    }
    setTimeout(() => {
      setShowEditForm((showEditForm) => !showEditForm);
      setEditStaffId(() => id);
    }, 0);
  };

  const openDeleteModal = (id: number, name: string) => {
      setDeleteStaffData({
        id: id,
        name: name,
      });
    setShowDeleteModal(() => true);
  };

  const onDelete = useCallback(
    (id: number) => {
      request(process.env.REACT_APP_PORT + `staffs/${id}`, "DELETE")
        .then(() => dispatch(staffDeleted(id)))
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
      {showAddForm && <AddStaffForm closeForm={() => setShowAddForm(false)} />}
      <StaffList onEdit={openEditForm} onDelete={openDeleteModal} />
      {showEditForm && (
        <EditStaffForm
          id={editStaffId}
          closeForm={() => setShowEditForm(false)}
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
