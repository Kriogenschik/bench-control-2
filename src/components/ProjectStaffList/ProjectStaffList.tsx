import { ProjectStaffProps } from "../ProjectsList/types";

import "./ProjectStaffList.scss";

interface ProjectStaffListProps {
  staffList: Array<ProjectStaffProps>;
	setStaffList : (list: Array<ProjectStaffProps>) => void;
}

export default function ProjectStaffList({
  staffList,
	setStaffList,
}: ProjectStaffListProps): JSX.Element {

	const remove = (id: string) => {
		setStaffList(staffList.filter((employ) => employ.id !== id));
	}
  return (
    <>
      {staffList.length ? (
        <div>
					<p className="form__list-row head">
						<span className="form__list-name head">Name:</span>
          	<span className="form__list-time head">Hours/ Week:</span>
          	<span className="form__list-type head">TypeB</span>
					</p>
          
          {staffList.map((staff) => {
            return (
              <p className="form__list-row" key={staff.id}>
                <span className="form__list-name">{staff.name}</span>
                <span className="form__list-time">{staff.time}</span>
                <span className="form__list-type">{staff.billingType}</span>
								<button className="form__list-btn" onClick={(e) => remove(staff.id)}>X</button>
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
