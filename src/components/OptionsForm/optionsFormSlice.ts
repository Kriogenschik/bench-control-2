import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";
import { OptionFullProps } from "./types";
import { RootState } from "../../store";

interface OptionsState extends EntityState<OptionFullProps> {
  optionsLoadingStatus: string;
}

interface AddOption {
  optionsId: number,
  newOptions: {
    optionName: string;
    descr: string;
    label: string;
    value: string;
  };
}

interface RemoveOption {
  id: number,
  optionsId: number,
  optionName: string;
}

interface EditOption {
  id: number,
  optionsId: number,
  optionsName: string,
  name: string,
  value: string;
}

const optionsAdapter = createEntityAdapter<OptionFullProps>();

const initialState: OptionsState = optionsAdapter.getInitialState({
  optionsLoadingStatus: "idle",
});

export const fetchOptions = createAsyncThunk<Array<OptionFullProps>>(
  "data/fetchOptions",
  () => {
    const { request } = useHttp();
    return request("http://localhost:5000/options");
  }
);

export const fetchAddOptions = createAsyncThunk(
  "data/fetchAddOptions",
  (params: AddOption, { dispatch }) => {
    const { request } = useHttp();
    const {optionsId, newOptions} = params;
    request(
      process.env.REACT_APP_PORT + `options/${optionsId}`,
      "POST",
      JSON.stringify(newOptions)
    )
      .then((res) => dispatch(optionsEdited({ optionsId, res })))
      .catch((err: any) => console.log(err));
  }
);

export const fetchRemoveOptions = createAsyncThunk(
  "data/fetchRemoveOptions",
  (params: RemoveOption, { dispatch }) => {
    const { request } = useHttp();
    const {id, optionsId, optionName} = params;
    request(
      process.env.REACT_APP_PORT + `options/${optionsId}`,
      "DELETE",
      JSON.stringify({optionName: optionName, id: id})
    )
      .then((res) => dispatch(optionsEdited({ optionsId, res })))
      .catch((err: any) => console.log(err));
  }
);

export const fetchEditOptions = createAsyncThunk(
  "data/fetchEditOptions",
  (params: EditOption, { dispatch }) => {
    const { request } = useHttp();
    const {id, optionsId, optionsName, name, value} = params;
    request(
      process.env.REACT_APP_PORT + `options/${optionsId}`,
      "PUT",
      JSON.stringify({
        optionsName: optionsName,
        id: id,
        name: name,
        value: value,
      })
    )
      .then((res) => {
        dispatch(optionsEdited({ optionsId, res }));
      })
      .catch((err: any) => console.log(err));
  }
);

export const fetchDeleteOptions = createAsyncThunk(
  "data/fetchDeleteOptions",
  (params: DeleteOptions, { dispatch }) => {
    const { request } = useHttp();
    const {optionName, optionsId, id} = params;
    request(
      process.env.REACT_APP_PORT + `options/${optionsId}`,
      "DELETE",
      JSON.stringify({optionName: optionName, id: id})
    )
      .then((res) => dispatch(optionsEdited({ optionsId, res })))
      .catch((err: any) => console.log(err));
  }
);

// export const fetchAddOptions = createAsyncThunk(
//   "data/fetchAddOptions",
//   (params: DeleteOptions, { dispatch }) => {
//     const { request } = useHttp();
//     const {optionName, optionsId, id} = params;
//     request(
//       process.env.REACT_APP_PORT + `options/${optionsId}`,
//       "DELETE",
//       JSON.stringify({optionName: optionName, id: id})
//     )
//       .then((res) => dispatch(optionsEdited({ optionsId, res })))
//       .catch((err: any) => console.log(err));
//   }
// );

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    optionsEdited: (state, action) => {
      optionsAdapter.updateOne(state, {
        id: action.payload.optionsId,
        changes: { ...action.payload.res },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchOptions.pending,
        (state: { optionsLoadingStatus: string }) => {
          state.optionsLoadingStatus = "loading";
        }
      )
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.optionsLoadingStatus = "idle";
        optionsAdapter.setAll(state, action.payload);
      })
      .addCase(
        fetchOptions.rejected,
        (state: { optionsLoadingStatus: string }) => {
          state.optionsLoadingStatus = "error";
        }
      )
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = optionsSlice;

export default reducer;
export const { optionsEdited } = actions;

export const { selectAll } = optionsAdapter.getSelectors(
  (state: RootState) => state.options
);

export const allOptionsSelector = createSelector(
  (state: { options: { optionsLoadingStatus: string } }) =>
    state.options.optionsLoadingStatus,
  selectAll,
  (state, options) => {
    if (state === "idle") {
      return options;
    }
  }
);
