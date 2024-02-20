import {createContext, useState} from "react";

export interface AuthProps {
  accessToken: string,
  name: string,
  isAuth: boolean,
}

export type AuthContextType = {
  userAuth: boolean;
  setUserAuth: (arg0: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [userAuth, setUserAuth] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{userAuth, setUserAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;