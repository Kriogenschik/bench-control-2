import { ProjectProps } from "../components/ProjectsList/types";
import { EmployeesProps } from "../components/StaffList/types";
import useCreateBenchList from "./useCreateBenchList";

export default function useCreateRedStaffList(staffList: Array<EmployeesProps>, projectsList: Array<ProjectProps>) {
    let benchStaffList = useCreateBenchList(staffList, projectsList).filter(staff => staff.color === "red");
    return benchStaffList;
}