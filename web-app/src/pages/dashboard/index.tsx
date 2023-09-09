import React, { useEffect, useState } from "react";

const serverUrl = process.env.REACT_APP_SERVER;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${serverUrl}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  console.log(process.env.REACT_APP_SERVER);
  return <div>a new page...</div>;
};

export default Dashboard;
