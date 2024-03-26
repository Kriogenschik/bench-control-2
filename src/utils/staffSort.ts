import { EmployeesProps } from "../components/StaffList/types";

export const staffSort = (
  arr: Array<EmployeesProps>,
  sortBy: string,
  sortTo: boolean
) => {
  let sortType: "name" | "pos" | "stack" | "exp" | "speak" | "time";

  switch (sortBy) {
    case "Name":
      sortType = "name";
      break;
    case "Position":
      sortType = "pos";
      break;
    case "Stack":
      sortType = "stack";
      break;
    case "Experience":
      sortType = "exp";
      break;
    case "Speak Lvl":
      sortType = "speak";
      break;
    case "Weekly Allowed Time":
      sortType = "time";
      break;
    default:
      break;
  }

  if (!sortTo) {
    return arr.sort(function (a, b) {
      if (a[sortType] > b[sortType]) {
        return 1;
      }
      if (a[sortType] < b[sortType]) {
        return -1;
      }
      return 0;
    });
  } else {
    return arr.sort(function (a, b) {
      if (a[sortType] < b[sortType]) {
        return 1;
      }
      if (a[sortType] > b[sortType]) {
        return -1;
      }
      return 0;
    });
  }
};
