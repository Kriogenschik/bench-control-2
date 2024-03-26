import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";
import { CreateProjectProps, ProjectProps } from "./types";
import { RootState } from "../../store";

interface ProjectsState extends EntityState<ProjectProps> {
  projectsLoadingStatus: string;
}

interface EditProject {
  id: number;
  editedProject: ProjectProps;
}

const projectsAdapter = createEntityAdapter<ProjectProps>();

const initialState: ProjectsState = projectsAdapter.getInitialState({
  projectsLoadingStatus: "idle",
});

export const fetchProjects = createAsyncThunk<Array<ProjectProps>>("data/fetchProjects", () => {
  const { request } = useHttp();
  return request("http://localhost:5000/projects");
});

export const fetchAddProject = createAsyncThunk(
  "data/fetchAddProject",
  (newProj: CreateProjectProps, { dispatch }) => {
    const { request } = useHttp();
    request(
      process.env.REACT_APP_PORT + `projects`,
      "POST",
      JSON.stringify(newProj)
    )
      .then((res) => dispatch(projectCreated(res)))
      .catch((err) => console.log(err));
  }
);

export const fetchDeleteProject = createAsyncThunk(
  "data/fetchDeleteProject",
  (id: number, { dispatch }) => {
    const { request } = useHttp();
    request(
      process.env.REACT_APP_PORT + `projects/${id}`,
      "DELETE"
    )
      .then((res) => dispatch(projectDeleted(res.id)))
      .catch((err: any) => console.log(err));
  }
);

export const fetchEditProject = createAsyncThunk(
  "data/fetchEditProject",
  (params: EditProject, { dispatch }) => {
    const { request } = useHttp();
    const id = params.id;
    request(
      process.env.REACT_APP_PORT + `projects/${id}`,
      "PUT",
      JSON.stringify(params.editedProject)
    )
      .then((res) => dispatch(projectEdited({ id, res })))
      .catch((err: any) => console.log(err));
  }
);


const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectCreated: (state, action) => {
      projectsAdapter.addOne(state, action.payload);
    },
    projectDeleted: (state , action: PayloadAction<string>) => {
      projectsAdapter.removeOne(state, action.payload);
    },
    projectEdited: (state, action) => {
      projectsAdapter.updateOne(state, {id: action.payload.id, changes: {...action.payload.res}});
    }
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

const { reducer } = projectsSlice;

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
export const { projectCreated, projectDeleted, projectEdited } = projectsSlice.actions;