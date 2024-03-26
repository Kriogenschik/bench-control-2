export interface EmployeesProps extends CreatedEmployeesProps {
  id: number;
}

export interface CreatedEmployeesProps {
  name: string;
  pos: string;
  stack: string;
  exp: string;
  speak: string;
  time: number;
}
