import {
  EntityState,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import { useHttp } from "../../hooks/http.hook";
import { UserProps } from "./types";
import { RootState } from "../../store";

interface UserState extends EntityState<UserProps> {
  userLoadingStatus: string;
}
const userAdapter = createEntityAdapter<UserProps>();

const initialState: UserState = userAdapter.getInitialState({
  userLoadingStatus: "idle",
});



export const fetchUser = createAsyncThunk<UserProps>(
  "data/fetchUser",
  async () => {
    const id = window.localStorage.getItem("id") || "";
    if (id) {
      const { request } = useHttp();
    const result = await request(`http://localhost:5000/auth/${id}`);
    return {
      id: id,
      token: "",
      isAuth: !!window.localStorage.getItem("isAuth"),
      isAdmin: result.isAdmin,
      name: result.name,
    };
    } else {
      return {
        id: '',
        token: "",
        isAuth: false,
        isAdmin: false,
        name: '',
      };
    }
    
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userSignIn: (state, action) => {
      userAdapter.addOne(state, action.payload);
    },
    userUpdate: (state, action) => {
      userAdapter.updateOne(state, {id: action.payload.id, changes: {...action.payload.editedUser}});
    },
    userSignOut: (state, action) => {
      userAdapter.removeAll(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchUser.pending,
      (state: { userLoadingStatus: string }) => {
        state.userLoadingStatus = "loading";
      }
    );
    builder.addCase(
      fetchUser.fulfilled,
      (state: UserState, action: PayloadAction<UserProps>) => {
        state.userLoadingStatus = "idle";
        userAdapter.setOne(state, action.payload);
      }
    );
    builder.addCase(
      fetchUser.rejected,
      (state: { userLoadingStatus: string }) => {
        state.userLoadingStatus = "error";
      }
    );
  },
});

export const { selectAll } = userAdapter.getSelectors(
  (state: RootState) => state.user
);

export const { userSignIn, userSignOut, userUpdate } = userSlice.actions;
export default userSlice.reducer;
