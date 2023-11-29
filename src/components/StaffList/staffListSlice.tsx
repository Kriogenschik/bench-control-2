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
import { RootState } from "../../store";

interface StaffState extends EntityState<EmployeesProps> {
  staffLoadingStatus: string;
}
const staffAdapter = createEntityAdapter<EmployeesProps>();

const initialState: StaffState = staffAdapter.getInitialState({
  staffLoadingStatus: "idle",
});

export const fetchStaff = createAsyncThunk<Array<EmployeesProps>>("data/fetchEmployees", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/employees");
});

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    staffDeleted: (state , action: PayloadAction<number>) => {
      staffAdapter.removeOne(state, action.payload);
    },
    staffCreated: (state, action) => {
      staffAdapter.addOne(state, action.payload);
    },
    staffEdited: (state, action) => {
      staffAdapter.updateOne(state, {id: action.payload.id, changes: {...action.payload.editedStaff}});
    }
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
