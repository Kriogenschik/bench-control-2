import Dropdown from "react-dropdown";
import BenchTable from "../BenchTable/BenchTable";
import { StaffBenchListProps } from "../BenchTable/types";
import { useEffect, useState } from "react";
import useCreateBenchList from "../../hooks/useCreateBenchList";
import { useSelector } from "react-redux";
import { allProjectsSelector } from "../ProjectsList/projectsListSlice";
import { ProjectProps } from "../ProjectsList/types";
import { allStaffSelector } from "../StaffList/staffListSlice";
import { EmployeesProps } from "../StaffList/types";
import Tooltips from "../Tooltips/Tooltips";

import "./Bench.scss";

const Bench = () => {
  const [colorZone, setColorZone] = useState("all");
  const [nameSearch, setNameSearch] = useState("");
  const [btnPosition, setBtnPostion] = useState<number>(0);
  const [isTipOpen, setIsTipOpen] = useState<boolean>(false);

  const zones = [
    {
      value: "all",
      label: "all zones",
      className: "dropdown__option dropdown__option--all",
    },
    {
      value: "red",
      label: "red",
      className: "dropdown__option dropdown__option--red",
    },
    {
      value: "yellow",
      label: "yellow",
      className: "dropdown__option dropdown__option--yellow",
    },
    {
      value: "green",
      label: "green",
      className: "dropdown__option dropdown__option--green",
    },
    {
      value: "grey",
      label: "grey",
      className: "dropdown__option dropdown__option--grey",
    },
  ];

  const staffs = useSelector(allStaffSelector) as Array<EmployeesProps>;
  const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;

  const [isListLoading, setIsListLoading] = useState(false);
  const  staffColor: Array<StaffBenchListProps> = useCreateBenchList(staffs, projectsList);
  const [staffList, setStaffList] =
    useState<Array<StaffBenchListProps>>(staffColor);

    const [staffColorFiltered, setStaffColorFiltered] = useState< Array<StaffBenchListProps>>(staffColor);


  useEffect(() => {
    const filteredStaffList: Array<StaffBenchListProps> = [];
    staffColorFiltered.forEach((employ) => {
      if (employ.name.toLowerCase().indexOf(nameSearch.toLowerCase()) === -1) {
        return;
      } else {
        filteredStaffList.push(employ);
      }
    });
    setStaffList(() => filteredStaffList);
  }, [nameSearch, staffColorFiltered]);

  useEffect(() => {
    if (colorZone === "all") setStaffColorFiltered(() => staffColor);
    else {
      setStaffColorFiltered(() => staffColor.filter((staff) => staff.color === colorZone))
    }// eslint-disable-next-line
  }, [colorZone]);

  if (!isListLoading && staffList.length) {
    setIsListLoading(true);
  } else if (staffColor.length && !staffList.length && !isListLoading) {
    setStaffList(staffColor);
      setStaffColorFiltered(staffColor);
      }

  const openTooltip = (e: any) => {
    e.preventDefault();
    setBtnPostion(e.target.getBoundingClientRect().right);
    setIsTipOpen(true);
  };

  const closeTip = () => {
    setIsTipOpen(false);
  };

  const ShowTooltip = () => {
    if (isTipOpen) {
      return (
        <Tooltips
          closeTip={closeTip}
          btnPosition={btnPosition}
          children={
            <>
              <p>
                <span>red</span> - less than 2 week
              </p>
              <p>
                <span>yellow</span> - less than month
              </p>
              <p>
                <span>green</span> - more than month
              </p>
              <p>
                <span>grey</span> - no active prject
              </p>
            </>
          }
        />
      );
    } else return null;
  };

  return (
    <div className="tab__body tab__bench">
      <div className="tab__actions">
        <div className="tab__actions-search">
          <span
            className="tab__actions-icon fa-solid fa-magnifying-glass fa-lg"
            style={{ color: "#619bff" }}
          ></span>
          <input
            type="text"
            className="form__input"
            placeholder="Name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>
        <div className="tab__actions-dropdown">
          <button className="form__tip-btn" onClick={(e) => openTooltip(e)}>
            ?
          </button>
          <Dropdown
            options={zones}
            value={colorZone}
            className="dropdown"
            arrowClosed={<span className="dropdown__arrow-closed" />}
            arrowOpen={<span className="dropdown__arrow-open" />}
            controlClassName="dropdown__button"
            menuClassName="dropdown__list"
            placeholderClassName="dropdown__placeholder"
            onChange={(e) => setColorZone(e.value)}
          />
          <ShowTooltip />
        </div>
      </div>
      <div className="tab__table">
        <BenchTable staffList={staffList} />
      </div>
    </div>
  );
};

export default Bench;
