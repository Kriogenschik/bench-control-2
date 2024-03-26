import ProjectStaffInputs from "../ProjectStaffInputs/ProjectStaffInputs";
import { ProjectProps, ProjectStaffProps } from "../ProjectsList/types";
import { EmployeesProps } from "../StaffList/types";

import "./ProjectStaffEditList.scss";

interface ProjectStaffEditListProps {
  projectID: number,
  allStaffList: Array<EmployeesProps>,
  staffList: Array<ProjectStaffProps>,
	setStaffList: (list: Array<ProjectStaffProps>) => void,
  projectsList: Array<ProjectProps>,
}

export default function ProjectStaffEditList({
  projectID,
  staffList,
	setStaffList,
  projectsList,
  allStaffList,
}: ProjectStaffEditListProps): JSX.Element {

  const otherProjectsList = projectsList.filter((project) => project.id !== projectID);

	const remove = (id: number) => {
		setStaffList(staffList.filter((employ) => employ.id !== id));
	}

  const changeStaffType = (id: number, staffTypeB: boolean) => {
    setStaffList(staffList.map((employ) => {
      if (employ.id === id) {
        return {
          ...employ,
          billingType: staffTypeB ? "UB" : "B",
        };
      } else return employ;
    }));
  }

  const changeStaffTime = (id: number, newTime: number) => {
    setStaffList(staffList.map((employ) => {
      if (employ.id === id) {
        return {
          ...employ,
          time: newTime,
        };
      } else return employ;
    }));
  }
	
  return (
    <>
      {staffList.length ? (
        <div className="form__list--edit">
					<p className="form__list-row head">
						<span className="form__list-name head">Name:</span>
          	<span className="form__list-time head">h/Week:</span>
          	<span className="form__list-type head">Billable</span>
					</p>
          
          {staffList.map((staff) => {
            return (
              <p className="form__list-row" key={staff.id}>
								<ProjectStaffInputs allStaffList={allStaffList} staff={staff} remove={remove} changeStaffType={changeStaffType} changeStaffTime={changeStaffTime} projectsList={otherProjectsList}/>
              </p>
            );
          })}
        </div>
      ) : (
        <p className="form__list-row">List is empty</p>
      )}
    </>
  );
}
