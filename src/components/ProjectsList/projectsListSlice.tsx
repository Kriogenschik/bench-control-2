import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";
import { ProjectProps } from "./types";
import { RootState } from "../../store";

interface ProjectsState extends EntityState<ProjectProps> {
  projectsLoadingStatus: string;
}

const projectsAdapter = createEntityAdapter<ProjectProps>();

const initialState: ProjectsState = projectsAdapter.getInitialState({
  projectsLoadingStatus: "idle",
});

export const fetchProjects = createAsyncThunk<Array<ProjectProps>>("data/fetchProjects", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/projects");
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // optionsEdited: (state, action) => {
    //   // @ts-ignore
    //   optionsAdapter.updateOne(state, {id: action.payload.optionsId, changes: {...action.payload.newOptionsList}});
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,(state: { projectsLoadingStatus: string }) => {
        state.projectsLoadingStatus = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state: ProjectsState, action: PayloadAction<Array<ProjectProps>>) => {
        state.projectsLoadingStatus = "idle";
        projectsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchProjects.rejected, (state: { projectsLoadingStatus: string }) => {
        state.projectsLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

const { actions, reducer } = projectsSlice;

export default reducer;

export const { selectAll } = projectsAdapter.getSelectors(
  (state: RootState) => state.projects
);

export const allProjectsSelector = createSelector(
  (state: { projects: { projectsLoadingStatus: string } }) =>
    state.projects.projectsLoadingStatus,
  selectAll,
  (state, projects) => {
    if (state === "idle") {
      return projects;
    }
  }
);
