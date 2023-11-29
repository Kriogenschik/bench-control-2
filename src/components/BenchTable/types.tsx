import { EmployeesProps } from "../StaffList/types";

export interface StaffBenchListProps extends EmployeesProps {
  projCount: number;
  freeTime: number;
  ubTime: number;
  freeAt: string;
  color: string;
}