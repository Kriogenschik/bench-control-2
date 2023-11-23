import { useCallback, useEffect, useState } from "react";
import DeleteModal from "../DeleteModal/DeleteModal";
import StaffList from "../StaffList/StaffList";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch } from "react-redux";
import { staffDeleted } from "../StaffList/staffListSlice";
import AddStafffForm from "../AddStaffForm/AddStaffForm";
import { fetchOptions } from "../OptionsForm/optionsFormSlice";
import { fetchStaff } from "../StaffList/staffListSlice";

const Staff = () => {
  interface deleteStaffDataProps {
    id: number;
    name: string;
  }

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteStaffData, setDeleteStaffData] = useState<deleteStaffDataProps>({
    id: 0,
    name: "",
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const { request } = useHttp();
  const dispatch = useDispatch();

useEffect(() => {
    // @ts-ignore
    dispatch(fetchStaff());
    // @ts-ignore
    dispatch(fetchOptions());
    // eslint-disable-next-line
  }, []);

  const OpenDeleteModal = (id: number, name: string) => {
    if (id && name) {
      setDeleteStaffData({
        id: id,
        name: name,
      });
    }
    setShowDeleteModal(() => true);
  };

  const onDelete = useCallback(
    (id: number) => {
      const url = `http://localhost:3001/employees/${id}`;
      request(url, "DELETE")
        // @ts-ignore
        .then(dispatch(staffDeleted(id)))
        .catch((err: any) => console.log(err));
      setShowDeleteModal(() => false);
    },
    // eslint-disable-next-line
    [request]
  );

  return (
    <div className="tab__body">
      {!showAddForm &&
        <button
        className="tab__btn tab__btn--add"
        onClick={() => setShowAddForm(true)}
      >
        Add
      </button>
      }
      
      {showAddForm && <AddStafffForm closeForm={() => setShowAddForm(false)} />}
      <StaffList onDelete={OpenDeleteModal} />
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
