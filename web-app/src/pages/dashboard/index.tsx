import React, { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./styles.css";
import { ModalContext } from "../../context/ModalContext";

const serverUrl = process.env.REACT_APP_SERVER;

export type Person = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  id?: string;
};

const PersonItem = ({
  person,
  handleDeletePerson,
  handleUpdatePerson,
}: {
  person: Person;
  handleDeletePerson: (id: string) => void;
  handleUpdatePerson: (id: string) => void;
}) => {
  const { user } = useAuth();
  const { showModal } = useContext(ModalContext);
  const isEditor = user?.username === "Editor";
  return (
    <>
      <div className="Rtable-cell Rtable-cell--head">{person.username}</div>
      <div className="Rtable-cell">
        <span className="labels">First Name:</span>
        {person.firstName}
      </div>
      <div className="Rtable-cell">
        <span className="labels">Last Name:</span>
        {person.lastName}
      </div>
      <div className={`Rtable-cell ${isEditor ? "" : "Rtable-cell--tail"}`}>
        <span className="labels">E-Mail:</span>
        {person.email}
      </div>
      {isEditor && (
        <div className={"Rtable-cell Rtable-cell--tail"}>
          <div>
            <button
              className="button"
              onClick={() => {
                showModal({
                  onSubmit: () => handleUpdatePerson(person.id!),
                  type: "edit",
                  person,
                });
              }}
            >
              edit entry
            </button>
            <button
              className="button red"
              onClick={() =>
                showModal({
                  onSubmit: () => handleDeletePerson(person.id!),
                  type: "confirm-delete",
                })
              }
            >
              delete entry
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const isEditor = user?.username === "Editor";
  const [users, setUsers] = useState<Person[]>([]);

  const [query, setQuery] = useState("");
  const { showModal } = useContext(ModalContext);

  type SortCategories = "username" | "firstName" | "lastName" | "email";
  type SortOptions = `${SortCategories}Asc` | `${SortCategories}Desc`;

  const [sortBy, setSortBy] = useState<SortOptions>();

  useEffect(() => {
    fetch(`${serverUrl}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    // if this was a real endpoint, I would have some sort of polling
    // or consider only running the query on submit
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

  const handleDeletePerson = useCallback((id: string) => {
    console.log("deleting:", id);
  }, []);

  const handleUpdatePerson = useCallback((id: string) => {
    console.log("updating:", id);
  }, []);

  const handleNewPerson = () => console.log("new person modal");

  return (
    <div>
      <div>
        <a className="breadcrumbs" href="/#">
          Jobs
        </a>
        |
        <a className="breadcrumbs" href="/#">
          Engineering
        </a>
      </div>
      <div className="space-between">
        <h1>Front End Developers</h1>
        <div>
          <button className="button red" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
      <div className="metadata">
        Full-time | On Location | Salary TBC | Dubai
      </div>

      <div className="data-section">
        <div className="text-input-wrapper">
          <label htmlFor="query">Search:</label>
          <input
            className="text-input"
            placeholder="search query"
            name="query"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        {isEditor && (
          <div className="add-entry--wrapper">
            <button
              onClick={() =>
                showModal({ onSubmit: () => handleNewPerson(), type: "create" })
              }
              className="button blue"
            >
              Add Entry
            </button>
          </div>
        )}
        <div className={`Rtable ${isEditor ? "editor" : "viewer"}`}>
          <div
            onClick={() => handleSortClick("username")}
            className="Rtable-cell sort-option"
          >
            <strong>Username</strong>
          </div>
          <div
            onClick={() => handleSortClick("firstName")}
            className="Rtable-cell sort-option"
          >
            <strong>First Name</strong>
          </div>
          <div
            onClick={() => handleSortClick("lastName")}
            className="Rtable-cell sort-option"
          >
            <strong>Last Name</strong>
          </div>
          <div
            onClick={() => handleSortClick("email")}
            className="Rtable-cell sort-option"
          >
            <strong>E-mail</strong>
          </div>
          {isEditor && (
            <div
              onClick={() => handleSortClick("email")}
              className="Rtable-cell sort-option"
            >
              <strong>Editor options</strong>
            </div>
          )}
          {users.map((person) => (
            <PersonItem
              key={person.id}
              person={person}
              handleDeletePerson={handleDeletePerson}
              handleUpdatePerson={handleUpdatePerson}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
