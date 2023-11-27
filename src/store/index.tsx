import { configureStore } from "@reduxjs/toolkit";
import staff from "../components/StaffList/staffListSlice";
import options from "../components/OptionsForm/optionsFormSlice";
import projects from '../components/ProjectsList/projectsListSlice'


const stringMiddleware = () => (next: (arg0: { type: string; }) => any) => (action: any) => {
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: {staff, options, projects},
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;