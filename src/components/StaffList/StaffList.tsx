import { useSelector } from "react-redux";
import { allStaffSelector } from "./staffListSlice";
import Spinner from "../Spinner/Spinner";
import { EmployeesProps } from "./types";
import { RootState } from "../../store";

import "./staffList.scss";
import { useEffect, useState } from "react";
import { staffSort } from "../../utils/staffSort";

interface StaffListProps {
  onDelete: (id: number, name: string) => void;
  onEdit: (id: number) => void;
}

const StaffList = ({ onDelete, onEdit }: StaffListProps): JSX.Element => {
  const allStaff = useSelector(allStaffSelector) as Array<EmployeesProps>;

  const isAdmin = useSelector(
    (state: RootState) => state.user.entities[window.localStorage.getItem("id") || ""]?.isAdmin
  );

  const [sortedStaff, setSortedStaff] = useState<Array<EmployeesProps>>([]);
  const [sortTo, setSortTo] = useState<string>("");
  const [isSortRise, setIsSortRise] = useState<boolean>(false);

  const handleSort = (sortBy: string) => {
    if (sortTo === sortBy && !isSortRise) {
      setIsSortRise(true);
      staffSort(allStaff, sortBy, true);
    } else if (sortTo === sortBy && isSortRise) {
      setIsSortRise(false);
      staffSort(allStaff, sortBy, false);
    } else {
      setIsSortRise(false);
      setSortTo(sortBy);
      staffSort(allStaff, sortBy, false);
    }
  };
  
  useEffect(() => {
    setSortedStaff(allStaff);
    if (allStaff && allStaff.length) {
      staffSort(allStaff, sortTo, isSortRise);
    }
  }, [allStaff]);

  const staffLoadingStatus = useSelector(
    (state: RootState) => state.staff.staffLoadingStatus
  );

  const projectsLoadingStatus = useSelector(
    (state: RootState) => state.projects.projectsLoadingStatus
  );

  if (staffLoadingStatus === "loading" || projectsLoadingStatus === "loading") {
    return <Spinner />;
  } else if (staffLoadingStatus === "error" || projectsLoadingStatus === "error") {
    return <h5 className="message">Loading Error...</h5>;
  }

  const head = [
    "Name",
    "Position",
    "Stack",
    "Experience",
    "Speak Lvl",
    "Weekly Allowed Time",
    isAdmin ? "" : null,
  ];

  const renderStaffTable = (arr: Array<EmployeesProps>) => {
    if (arr && arr.length === 0) {
      return <h5 className="message">List is empty...</h5>;
    }

    return (
      <div className="staff-container">
        <table className="staff-table">
          <thead>
            <tr>
              {head.map((item) => {
                let headClass = "";
                if (item !== "" && item === sortTo) {
                  if (isSortRise) {
                    headClass = "staff-table__head-btn up";
                  } else {
                    headClass = "staff-table__head-btn down";
                  }
                } else if (item !== "") {
                  headClass = "staff-table__head-btn";
                }
                if (item !== null) {
                  return (
                    <th
                      key={item}
                      className={headClass}
                      onClick={() => handleSort(item)}
                    >
                      {item}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {arr &&
              arr.map((item) => {
                return (
                  <tr key={item.id} className="staff-table__row">
                    <td>{item.name}</td>
                    <td>{item.pos}</td>
                    <td>{item.stack}</td>
                    <td>{item.exp}</td>
                    <td>{item.speak}</td>
                    <td>{item.time}</td>
                    {isAdmin && (
                      <td className="edit-cell">
                        <button
                          className="staff-table__btn fa-solid fa-user-pen fa-lg"
                          onClick={() => onEdit(item.id)}
                        ></button>
                        <button
                          className="staff-table__btn fa-solid fa-trash-can fa-lg"
                          onClick={() => onDelete(item.id, item.name)}
                        ></button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  };

  const elements = renderStaffTable(sortedStaff);

  return <div>{elements}</div>;
};

export default StaffList;
