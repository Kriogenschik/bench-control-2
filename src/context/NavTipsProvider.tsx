import {createContext, useState} from "react";

export interface NavTipsProps {
  projectsCount: number,
  staffCount: number,
}

export type NavTipsContextType = {
  projectsCount: number;
  setProjectsCount: (arg0: number) => void;
  staffCount: number;
  setStaffCount: (arg0: number) => void;
}

const NavTipsContext = createContext<NavTipsContextType | null>(null);


export const NavTipsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);

  return (
    <NavTipsContext.Provider value={{projectsCount, setProjectsCount, staffCount, setStaffCount}}>
      {children}
    </NavTipsContext.Provider>
  )
}

export default NavTipsContext;