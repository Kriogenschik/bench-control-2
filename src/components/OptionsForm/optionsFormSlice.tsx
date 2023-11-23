import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";
import { OptionsProps } from "../../data/DropdownOptions";


interface OptionsState {
  optionsLoadingStatus: string;
}

const optionsAdapter = createEntityAdapter();

const initialState:OptionsState = optionsAdapter.getInitialState({
  optionsLoadingStatus: "idle",
});

export const fetchOptions = createAsyncThunk("data/fetchOptions", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/options");
});

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    // optionsCreated: (state, action) => {
    //   optionsAdapter.addOne(state, action.payload);
    // },
    // optionsDeleted: (state, action) => {
    //   optionsAdapter.removeOne(state, action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending,(state: { optionsLoadingStatus: string }) => {
        state.optionsLoadingStatus = "loading";
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.optionsLoadingStatus = "idle";
        // @ts-ignore
        optionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchOptions.rejected, (state: { optionsLoadingStatus: string }) => {
        state.optionsLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = optionsSlice;

export default reducer;
// export const {
//   optionsCreated,
//   optionsDeleted,
// } = actions;
export const { selectAll } = optionsAdapter.getSelectors(
  // @ts-ignore
  (state) => state.options
);