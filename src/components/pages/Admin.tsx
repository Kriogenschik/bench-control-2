import { useDispatch, useSelector } from "react-redux";
import OptionsForm from "../OptionsForm/OptionsForm";
import { allOptionsSelector, fetchOptions } from "../OptionsForm/optionsFormSlice";
import Spinner from "../Spinner/Spinner";
import { OptionFullProps } from "../OptionsForm/types";
import { AppDispatch, RootState } from "../../store";
import { useEffect } from "react";

import "./Admin.scss";

const Admin = ():JSX.Element => {
  const optionsLoadingStatus = useSelector(
    (state: RootState) => state.options.optionsLoadingStatus
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOptions());
    // eslint-disable-next-line
  }, []);

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
              optionTitle={item.title}
              optionsArr={item.arr}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
