// import {
//   createSlice,
//   createAsyncThunk,
//   createEntityAdapter,
//   PayloadAction,
//   EntityState,
// } from "@reduxjs/toolkit";
import { EmployeesProps } from "../../data/Employees";

// import { employees } from "../../data/Employees";

// // interface StaffState {
// //   entities:  EntityState<unknown>
// //   staffLoadingStatus: 'idle' | 'loading' | 'error'
// // }

// export interface StaffState {
//   staff: Array<EmployeesProps>
//   staffLoadingStatus: string,
// }

// const staffAdapter = createEntityAdapter<Array<EmployeesProps>>();

// const initialState = staffAdapter.getInitialState({
//   staffLoadingStatus: "idle",
// })

// export const fetchStaff = createAsyncThunk("staff/fetchStaff", () => {
//   // const {request} =  JSON.parse(localStorage.staff);
//   console.log(1);
// 	return employees;
// });

// const staffSlice = createSlice({
//   name: "staff",
//   initialState,
//   reducers: {
//     staffCreated: (state, action) => {
//       staffAdapter.addOne(state, action.payload);
//     },
//     staffDeleted: (state, action: PayloadAction<number>) => {
//       staffAdapter.removeOne(state, action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStaff.pending, (state) => {
//         state.staffLoadingStatus = "loading";
//       })
//       // .addCase(fetchStaff.fulfilled, (state, action) => {
//       //   state.staffLoadingStatus = "idle";
//       //   staffAdapter.setAll(state, action.payload);
//       // })
//       .addCase(fetchStaff.rejected, (state) => {
//         state.staffLoadingStatus = "error";
//       })
//       .addDefaultCase(() => {});
//   },
// });

// const { actions, reducer } = staffSlice;

// // export const { selectAll } = staffAdapter.getSelectors(
// //   (state: StaffState) => state.entities
// // );

// export default reducer;
// export const {
//   staffCreated,
//   staffDeleted,
// } = actions;

import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import type { EntityState, PayloadAction } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

interface StaffState {
  // entity: Array<EmployeesProps>;
  // entity?: [],
  staffLoadingStatus: string;
}
const staffAdapter = createEntityAdapter();

// const initialState = { staff: [], staffLoadingStatus: "idle" } as staffState;

const initialState: StaffState = staffAdapter.getInitialState({
  staffLoadingStatus: "idle",
});

export const fetchStaff = createAsyncThunk("data/fetchEmployees", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/employees");
});

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    staffDeleted: (state, action) => {
      // @ts-ignore
      staffAdapter.removeOne(state, action.payload);
    },
    staffCreated: (state, action) => {
      // @ts-ignore
      staffAdapter.addOne(state, action.payload);
    },
    staffEdited: (state, action) => {
      // @ts-ignore
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
    builder.addCase(fetchStaff.fulfilled, (state, action) => {
      state.staffLoadingStatus = "idle";
      // @ts-ignore
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
  // @ts-ignore
  (state) => state.staff
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
