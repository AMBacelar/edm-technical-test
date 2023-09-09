import { useState } from "react";
import "./App.css";
import Login from "./pages/login";
import { AuthContext } from "./context/AuthContext";
import { User } from "./hooks/useUser";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/dashboard";

const Routes = () => {
  // there are no routes tbf... I just need a component
  // with access to the auth context to know whether
  // the user is logged in or not

  <div className="wrapper"></div>;

  const { user } = useAuth();
  if (!user) {
    return (
      <div className="wrapper">
        <Login />
      </div>
    );
  }
  return (
    <div className="wrapper">
      <Dashboard />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes />
    </AuthContext.Provider>
  );
};

export default App;
