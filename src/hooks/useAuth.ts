import { useContext, useDebugValue} from "react";
import AuthContext, { AuthContextType, AuthProps } from "../context/AuthProvider";

const useAuth = () => {
  const {userAuth} = useContext(AuthContext) as AuthContextType;
  useDebugValue(userAuth, auth => auth ? "Logged In" : "Logged Out")
  return useContext(AuthContext);
}

export default useAuth;