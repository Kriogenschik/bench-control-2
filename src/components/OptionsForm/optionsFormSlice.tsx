import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const optionsAdapter = createEntityAdapter();

const initialState = optionsAdapter.getInitialState({
  staffLoadingStatus: "idle",
});

export const fetchOptions = createAsyncThunk("options/fetchOptions", () => {
  const request = JSON.parse( localStorage.options );
	return request;
});

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    optionsCreated: (state, action) => {
      optionsAdapter.addOne(state, action.payload);
    },
    optionsDeleted: (state, action) => {
      optionsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        state.staffLoadingStatus = "loading";
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.staffLoadingStatus = "idle";
        optionsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchOptions.rejected, (state) => {
        state.staffLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = optionsSlice;

export default reducer;
export const {
  optionsCreated,
  optionsDeleted,
} = actions;
