import {
  EntityState,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { useHttp } from "../../hooks/http.hook";
import { EmployeesProps } from "./types";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { allProjectsSelector, projectEdited } from "../ProjectsList/projectsListSlice";
import { EditProjectByStaffRemove } from "../../utils/EditProjectByStaffRemove";
import { ProjectProps } from "../ProjectsList/types";



interface StaffState extends EntityState<EmployeesProps> {
  staffLoadingStatus: string;
}
const staffAdapter = createEntityAdapter<EmployeesProps>();

const initialState: StaffState = staffAdapter.getInitialState({
  staffLoadingStatus: "idle",
});

export const fetchStaff = createAsyncThunk<Array<EmployeesProps>>("data/fetchEmployees", () => {
  const { request } = useHttp();
  return request("http://localhost:5000/staff",
  );
});

export const fetchDeleteStaff = createAsyncThunk(
  'data/fetchDeleteEmployees',
  (staffId: number) => {
    const dispatch = useDispatch<AppDispatch>();
    const projectsList = useSelector(allProjectsSelector) as Array<ProjectProps>;
    const { request } = useHttp();
    request(process.env.REACT_APP_PORT + `staff/${staffId}`, "DELETE")
        .then((res) =>  dispatch(staffDeleted(res.id)))
        .then(() => EditProjectByStaffRemove(projectsList, staffId).forEach(project => {
          const projectId = project.id;
            request(
              process.env.REACT_APP_PORT + `projects/${projectId}`,
              "PATCH",
              JSON.stringify(project)
            )
              .then((res) => dispatch(projectEdited({ projectId, project })))
              .catch((err: any) => console.log(err));
        }))
        .catch((err: any) => console.log(err));
  }
  // async ({staffId, projectsList}, thunkAPI) => {
  //   const dispatch = useDispatch<AppDispatch>();
  //   const { request } = useHttp();
  //   request(process.env.REACT_APP_PORT + `staff/${staffId}`, "DELETE")
  //       .then((res) =>  dispatch(staffDeleted(res.id)))
  //       .then(() => EditProjectByStaffRemove(projectsList, staffId).forEach(project => {
  //         const projectId = project.id;
  //           request(
  //             process.env.REACT_APP_PORT + `projects/${projectId}`,
  //             "PATCH",
  //             JSON.stringify(project)
  //           )
  //             .then((res) => dispatch(projectEdited({ projectId, project })))
  //             .catch((err: any) => console.log(err));
  //       }))
  //       .catch((err: any) => console.log(err));
  // }
)

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    staffDeleted: (state , action: PayloadAction<string>) => {
      staffAdapter.removeOne(state, action.payload);
    },
    staffCreated: (state, action) => {
      staffAdapter.addOne(state, action.payload);
    },
    staffEdited: (state, action) => {
      staffAdapter.updateOne(state, {id: action.payload.id, changes: {...action.payload.res}});
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchStaff.pending,
      (state: { staffLoadingStatus: string }) => {
        state.staffLoadingStatus = "loading";
      }
    );
    builder.addCase(fetchStaff.fulfilled, (state: StaffState, action: PayloadAction<Array<EmployeesProps>>) => {
      state.staffLoadingStatus = "idle";
      staffAdapter.setAll(state, action.payload);
    });
    builder.addCase(
      fetchStaff.rejected,
      (state: { staffLoadingStatus: string }) => {
        state.staffLoadingStatus = "error";
      }
    );
  },
});

export const { selectAll } = staffAdapter.getSelectors(
  (state: RootState) => state.staff
);


export const allStaffSelector = createSelector(
  (state: { staff: { staffLoadingStatus: string } }) =>
    state.staff.staffLoadingStatus,
  selectAll,
  (state, staff) => {
    if (state === "idle") {
      return staff;
    }
  }
);

export const { staffDeleted, staffCreated, staffEdited } = staffSlice.actions;
export default staffSlice.reducer;
