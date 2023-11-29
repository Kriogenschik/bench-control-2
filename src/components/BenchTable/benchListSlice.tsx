import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { StaffBenchListProps } from "./types";
import useCreateBenchList from "../../hooks/useCreateBenchList";

interface BenchState extends EntityState<StaffBenchListProps> {
  benchLoadingStatus: string;
}

const benchAdapter = createEntityAdapter<StaffBenchListProps>();

// const initialState: BenchState = benchAdapter.getInitialState({
//   benchLoadingStatus: "idle",
// });

// const initialState = () => {
//   const list = useCreateBenchList();
// }

// export const fetchBench = createAsyncThunk<Array<StaffBenchListProps>>("data/fetchBench", () => {
//   const { request } = useHttp();
//   return request("http://localhost:3001/options");
// });

// const optionsSlice = createSlice({
//   name: "bench",
//   initialState: useCreateBenchList() as BenchState[],
//   reducers: {
//     optionsEdited: (state, action) => {
//       optionsAdapter.updateOne(state, {id: action.payload.optionsId, changes: {...action.payload.newOptionsList}} );
//     }
//   },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchOptions.pending,(state: { optionsLoadingStatus: string }) => {
  //       state.optionsLoadingStatus = "loading";
  //     })
  //     .addCase(fetchOptions.fulfilled, (state, action) => {
  //       state.optionsLoadingStatus = "idle";
  //       optionsAdapter.setAll(state, action.payload);
  //     })
  //     .addCase(fetchOptions.rejected, (state: { optionsLoadingStatus: string }) => {
  //       state.optionsLoadingStatus = "error";
  //     })
  //     .addDefaultCase(() => {});
  // },
// });

// const { actions, reducer } = optionsSlice;

// export default reducer;
// export const {
//   optionsEdited,
// } = actions;

// export const { selectAll } = optionsAdapter.getSelectors(
//   (state: RootState) => state.options
// );

// export const allOptionsSelector = createSelector(
//   (state: { options: { optionsLoadingStatus: string } }) =>
//     state.options.optionsLoadingStatus,
//   selectAll,
//   (state, options) => {
//     if (state === "idle") {
//       return options;
//     }
//   }
// );
