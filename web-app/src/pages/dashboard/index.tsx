import React, { useCallback, useEffect, useState } from "react";
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

  type SortCategories = "username" | "firstName" | "lastName" | "email";
  type SortOptions = `${SortCategories}Asc` | `${SortCategories}Desc`;

  const [sortBy, setSortBy] = useState<SortOptions>();

  useEffect(() => {
    fetch(`${serverUrl}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    fetch(
      `${serverUrl}/users?${new URLSearchParams({
        query,
        sortBy: sortBy as string,
      })}`
    )
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [query, sortBy]);

  const handleSortClick = useCallback(
    (categoryToToggle: SortCategories) => {
      const sortMap = {
        username: ["usernameAsc", "usernameDesc"],
        firstName: ["firstNameAsc", "firstNameDesc"],
        lastName: ["lastNameAsc", "lastNameDesc"],
        email: ["emailAsc", "emailDesc"],
      } as const;

      const targetSort =
        sortMap[categoryToToggle][0] === sortBy
          ? sortMap[categoryToToggle][1]
          : sortMap[categoryToToggle][0];

      setSortBy(targetSort);
    },
    [sortBy]
  );

  const handleQueryChange = useCallback(
    (newValue: string) => setQuery(newValue),
    [setQuery]
  );

  return (
    <div>
      <h1>People</h1>
      <div>
        <button onClick={() => logout()}>Logout</button>
        {user?.username === "Editor" && <button>Add Entry</button>}
      </div>
      <input
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
      />
      <div>current sort: {sortBy}</div>
      <div>
        <div className="Rtable">
          <div
            onClick={() => handleSortClick("username")}
            className="Rtable-cell Rtable-cell--head"
          >
            <strong>username</strong>
          </div>
          <div
            onClick={() => handleSortClick("firstName")}
            className="Rtable-cell"
          >
            <strong>firstName</strong>
          </div>
          <div
            onClick={() => handleSortClick("lastName")}
            className="Rtable-cell"
          >
            <strong>lastName</strong>
          </div>
          <div
            onClick={() => handleSortClick("email")}
            className="Rtable-cell Rtable-cell--foot"
          >
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
