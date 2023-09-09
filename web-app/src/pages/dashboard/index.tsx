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

const PersonItem = ({ person }: { person: Person }) => {
  return (
    <>
      <div className="Rtable-cell Rtable-cell--head">
        <h3>{person.username}</h3>
      </div>
      <div className="Rtable-cell">{person.firstName}</div>
      <div className="Rtable-cell">{person.lastName}</div>
      <div className="Rtable-cell Rtable-cell--foot">
        <strong>{person.email}</strong>
      </div>
    </>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<Person[]>([]);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetch(`${serverUrl}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    fetch(`${serverUrl}/users?${new URLSearchParams({ query, sortBy })}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [query, sortBy]);

  return (
    <div>
      <p>a new page...</p>
      <h1>People</h1>
      <div>
        <button onClick={() => logout()}>Logout</button>
        {user?.username === "Editor" && <button>Add Entry</button>}
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div>
        <div className="Rtable">
          <div className="Rtable-cell Rtable-cell--head">
            <strong>username</strong>
          </div>
          <div className="Rtable-cell">
            <strong>firstName</strong>
          </div>
          <div className="Rtable-cell">
            <strong>lastName</strong>
          </div>
          <div className="Rtable-cell Rtable-cell--foot">
            <strong>email</strong>
          </div>
          {users.map((person) => (
            <PersonItem key={person.id} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
