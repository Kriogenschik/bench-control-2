import { useSelector } from "react-redux";
import OptionsForm from "../OptionsForm/OptionsForm";
import { allOptionsSelector } from "../OptionsForm/optionsFormSlice";
import Spinner from "../Spinner/Spinner";
import { OptionFullProps } from "../OptionsForm/types";
import { RootState } from "../../store";

import "./Admin.scss";

const Admin = () => {
  const optionsLoadingStatus = useSelector(
    (state: RootState) => state.options.optionsLoadingStatus
  );

  const allOptions = useSelector(allOptionsSelector) as Array<OptionFullProps>;

  if (optionsLoadingStatus === "loading") {
    return (
      <div className="tab__body">
        <Spinner />
      </div>
    );
  } else if (optionsLoadingStatus === "error") {
    return (
      <div className="tab__body">
        <h5 className="message">Loading Error...</h5>
      </div>
    );
  }

  return (
    <div className="tab__body">
      <div className="tab__container">
        <h2 className="tab__title">Employees options:</h2>
        {allOptions.map((item) => {
          return (
            <OptionsForm
              key={item.id}
              optionsId={item.id}
              optionName={item.name}
              optionsArr={item.arr}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
