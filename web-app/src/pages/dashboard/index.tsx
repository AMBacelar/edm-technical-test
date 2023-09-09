import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const serverUrl = process.env.REACT_APP_SERVER;

type Person = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<Person[]>([]);
  useEffect(() => {
    fetch(`${serverUrl}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <p>a new page...</p>
      <h1>table</h1>
      <div>
        <button onClick={() => logout()}>Logout</button>
        {user?.username === "Editor" && <button>Add Entry</button>}
      </div>

      <div>{JSON.stringify(users, null, 2)}</div>
    </div>
  );
};

export default Dashboard;
