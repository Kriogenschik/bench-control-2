import React, { useState } from "react";
import Dropdown from "react-dropdown";
// import getAllOptions from "../../utils/GetAllOptions";
import Tooltips from "../Tooltips/Tooltips";
import { OptionProps } from "../OptionsForm/types";

import "./DropdownInput.scss";

interface DropdownProps {
  optionsList: Array<OptionProps>;
  label: string;
  value: string;
  placeholder: string;
  handleChange: (e: { value: React.SetStateAction<string> }) => void;
  dropdownClass: string;
}

const DropdownInput = ({
  optionsList,
  label,
  value,
  placeholder,
  dropdownClass,
  handleChange,
}: DropdownProps): JSX.Element => {
  const [isTipOpen, setIsTipOpen] = useState<boolean>(false);
  const [btnPosition, setBtnPostion] = useState<number>(0);
  // const optionsList = [
  //   { id: 1, value: "DEV", label: "DEV", name: "Dev" },
  //   { id: 2, value: "QA", label: "QA", name: "QA" },
  //   { id: 3, value: "S", label: "S", name: "Sales" },
  //   { id: 4, value: "MP", label: "MP", name: "Markup" },
  //   { id: 5, value: "D", label: "D", name: "Design" },
  //   { id: 6, value: "BA", label: "BA", name: "BA" },
  //   { id: 7, value: "PM", label: "PM", name: "PM" },
  // ];

  const closeTip = () => {
    setIsTipOpen(false);
  };

  const openTooltip = (e: any) => {
    e.preventDefault();
    setBtnPostion(e.target.getBoundingClientRect().right);
    setIsTipOpen(true);
  };

  const ShowTooltip = () => {
    if (isTipOpen) {
      return (
        <Tooltips
          closeTip={closeTip}
          btnPosition={btnPosition}
          children={optionsList.map((option) => {
            return (
              <div className="form__tip-row" key={option.id}>
                <b>{option.value}</b> - {option.descr}
              </div>
            );
          })}
        />
      );
    } else return null;
  };

  return (
    <>
      <label>{label}</label>
      <button
        className="form__tip-btn"
        onClick={(e) => openTooltip(e)}
      >?</button>
      <Dropdown
        options={optionsList}
        value={value}
        placeholder={placeholder}
        className="dropdown"
        arrowClosed={<span className="dropdown__arrow-closed" />}
        arrowOpen={<span className="dropdown__arrow-open" />}
        controlClassName={dropdownClass}
        menuClassName="dropdown__list"
        placeholderClassName="dropdown__placeholder"
        onChange={handleChange}
      />
      <ShowTooltip />
    </>
  );
}

DropdownInput.defaultProps = { dropdownClass: "dropdown__button" };

export default DropdownInput;
