import { StaffBenchListProps } from "./types";
import { useSelector } from "react-redux";
import { allOptionsSelector } from "../OptionsForm/optionsFormSlice";
import { OptionFullProps, OptionProps } from "../OptionsForm/types";
import dateFormat from "../../utils/dateFormat";

import "./BenchTable.scss";

interface BenchTableProps {
  staffList: Array<StaffBenchListProps>;
}

export default function BenchTable({ staffList }: BenchTableProps) {
  const head = [
    "Name",
    "Position",
    "Project Count",
    "Stack",
    "Experience",
    "Speak Lvl",
    "Allowed Time",
    "Actual Free Time",
    "Unbillable Time",
    "Possible Free At",
  ];

  const allOptions = useSelector(allOptionsSelector) as Array<OptionFullProps>;
  let positions: Array<OptionProps> = [];
  if (allOptions) {
    positions = allOptions.filter((opt) => opt.name === "roles")[0]?.["arr"];
  }
  let sortedStaffList = [];
  if (positions && positions.length && staffList) {
    for (let i = 0; positions.length > i; i++) {
      const newStaffList = staffList.filter(
        (staff) => staff.pos === positions[i]?.value
      );
      if (newStaffList.length) {
        sortedStaffList.push(newStaffList);
      }
    }
  }

  return (
    <>
      {sortedStaffList.length ? (
        sortedStaffList.map((staffList) => {
          return (
            <table className="bench-table" key={staffList[0]?.pos}>
              <thead>
                <tr>
                  {head.map((item) => {
                    return <th key={item}>{item}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {staffList.length ? (
                  staffList.map((staff) => {
                    return (
                      <tr key={staff.id} className="bench-table__row">
                        <td>{staff.name}</td>
                        <td>{staff.pos}</td>
                        <td>{staff.projCount}</td>
                        <td>{staff.stack}</td>
                        <td>{staff.exp}</td>
                        <td>{staff.speak}</td>
                        <td>{staff.time}</td>
                        <td>{staff.freeTime}</td>
                        <td>{staff.ubTime}</td>
                        <td className={`bench-table__cell ${staff.color}`}>
                          {dateFormat(staff.freeAt)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>
                      <p className="bench-table__placeholder">
                        List is Empty...
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          );
        })
      ) : (
        <p>List is Empty...</p>
      )}
    </>
  );
}
