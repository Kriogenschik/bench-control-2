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

export const fetchStaff = createAsyncThunk("heroes/fetchEmployees", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/employees");
});

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // staffCreated: (state, action: PayloadAction<EmployeesProps>) => {
    //   state.staff.push(action.payload);
    // },
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
  (state: StaffState) => state.staff
);

// export const { staffCreated } = staffSlice.actions;
export default staffSlice.reducer;
