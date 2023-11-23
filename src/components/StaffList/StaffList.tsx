
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { fetchStaff, selectAll, staffDeleted, allStaffSelector } from "./staffListSlice";
import Spinner from "../Spinner/Spinner";
import { EmployeesProps } from "../../data/Employees";

import './staffList.scss'

interface StaffListProps {
  onDelete: (id: number, name: string ) => void;
}

const StaffList = ({onDelete}: StaffListProps): JSX.Element => {
  const dispatch = useDispatch();
  
  // @ts-ignore
  const allStaff: Array<EmployeesProps> = useSelector(allStaffSelector);

  const staffLoadingStatus = useSelector(
    // @ts-ignore
    (state) => state.staff.staffLoadingStatus
  );

  // useEffect(() => {
  //   // @ts-ignore
  //   dispatch(fetchStaff());
  //   // eslint-disable-next-line
  // }, []);

  

  if (staffLoadingStatus === "loading") {
    return <Spinner />;
  } else if (staffLoadingStatus === "error") {
    return <h5 className="message">Loading Error...</h5>;
  }

  const head = [
    "Name",
    "Position",
    "Stack",
    "Experience",
    "Speak Lvl",
    "Weekly Allowed Time",
    "controls"
  ];

  const renderStaffTable = (arr: Array<EmployeesProps>) => {
    if (arr.length === 0) {
      return <h5 className="message">List is empty...</h5>;
    }

    return (
      <>
        <table className="staff-table">
          <thead>
            <tr>
              {head.map((item) => {
                return <th key={item}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {arr.map((item) => {
              return (
                <tr key={item.id} className="staff-table__row">
                  <td>{item.name}</td>
                  <td>{item.pos}</td>
                  <td>{item.stack}</td>
                  <td>{item.exp}</td>
                  <td>{item.speak}</td>
                  <td>{item.time}</td>
                  <td className="edit-cell">
                  <button className="staff-table__btn fa-solid fa-user-pen fa-lg"></button>
                  <button className="staff-table__btn fa-solid fa-trash-can fa-lg" onClick={() => onDelete(item.id, item.name)}></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  const elements = renderStaffTable(allStaff);

  return <div>
    {elements}
  </div>
};

export default StaffList;
