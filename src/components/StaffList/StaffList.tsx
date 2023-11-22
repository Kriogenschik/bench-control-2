import store from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchStaff, selectAll } from "./staffListSlice";
import Spinner from "../Spinner/Spinner";
import { EmployeesProps } from "../../data/Employees";

import './staffList.scss'

const StaffList = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const allStaff: Array<EmployeesProps> = selectAll(store.getState());

  const staffLoadingStatus = useSelector(
    // @ts-ignore
    (state) => state.staff.staffLoadingStatus
  );

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchStaff());
    // eslint-disable-next-line
  }, []);

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
                  <td>
                
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
