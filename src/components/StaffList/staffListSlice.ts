import {
  EntityState,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { useHttp } from "../../hooks/http.hook";
import { CreatedEmployeesProps, EmployeesProps } from "./types";
import { AppDispatch, RootState } from "../../store";
import { projectEdited } from "../ProjectsList/projectsListSlice";
import { editProjectByStaffRemove } from "../../utils/editProjectByStaffRemove";
import { ProjectProps } from "../ProjectsList/types";
import { editProjectByStaffChange } from "../../utils/editProjectByStaffChange";

interface StaffState extends EntityState<EmployeesProps> {
  staffLoadingStatus: string;
}

interface DeleteStaff {
  id: number;
  projList: Array<ProjectProps>;
}

interface EditStaff extends DeleteStaff{
  editedStaff: EmployeesProps;
}

const staffAdapter = createEntityAdapter<EmployeesProps>();

const initialState: StaffState = staffAdapter.getInitialState({
  staffLoadingStatus: "idle",
});

export const fetchStaff = createAsyncThunk<Array<EmployeesProps>>(
  "data/fetchEmployees",
  () => {
    const { request } = useHttp();
    return request("http://localhost:5000/staff");
  }
);

export const fetchDeleteStaff = createAsyncThunk(
  "data/fetchDeleteEmployees",
  (params: DeleteStaff, { dispatch }) => {
    const { request } = useHttp();
    request(process.env.REACT_APP_PORT + `staff/${params.id}`, "DELETE")
      .then((res) => dispatch(staffDeleted(res.id)))
      .then(() =>
        editProjectByStaffRemove(params.projList, params.id).forEach(
          (project) => {
            const projectId = project.id;
            request(
              process.env.REACT_APP_PORT + `projects/${projectId}`,
              "PUT",
              JSON.stringify(project)
            )
              .then((res) => dispatch(projectEdited({ projectId, res })))
              .catch((err: any) => console.log(err));
          }
        )
      )
      .catch((err: any) => console.log(err));
  }
);

export const fetchAddStaff = createAsyncThunk(
  "data/fetchAddEmployees",
  (newStaff: CreatedEmployeesProps, { dispatch }) => {
    const { request } = useHttp();
    request(
      process.env.REACT_APP_PORT + "staff",
      "POST", 
      JSON.stringify(newStaff)
    )
      .then((res) => dispatch(staffCreated(res)))
      .catch((err) => console.log(err));
  }
);

export const fetchEditStaff = createAsyncThunk(
  "data/fetchEditEmployees",
  (params: EditStaff, { dispatch }) => {
    const { request } = useHttp();
    const id = params.id;
    request(
      process.env.REACT_APP_PORT + `staff/${id}`,
      "PUT",
      JSON.stringify(params.editedStaff)
    )
      .then((res) => dispatch(staffEdited({ id, res })))
      .then(() => {
        editProjectByStaffChange(params.projList, params.editedStaff).forEach(
          (project) => {
            const projectId = project.id;
            request(
              process.env.REACT_APP_PORT + `projects/${projectId}`,
              "PUT",
              JSON.stringify(project)
            )
              .then(() => dispatch(projectEdited({ projectId, project })))
              .catch((err: any) => console.log(err));
          }
        );
      })
      .catch((err: any) => console.log(err));
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    staffDeleted: (state, action: PayloadAction<string>) => {
      staffAdapter.removeOne(state, action.payload);
    },
    staffCreated: (state, action) => {
      staffAdapter.addOne(state, action.payload);
    },
    staffEdited: (state, action) => {
      staffAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { ...action.payload.res },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchStaff.pending,
      (state: { staffLoadingStatus: string }) => {
        state.staffLoadingStatus = "loading";
      }
    );
    builder.addCase(
      fetchStaff.fulfilled,
      (state: StaffState, action: PayloadAction<Array<EmployeesProps>>) => {
        state.staffLoadingStatus = "idle";
        staffAdapter.setAll(state, action.payload);
      }
    );
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
