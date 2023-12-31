import React, { useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./styles.css";
import { ModalContext } from "../../context/ModalContext";
import { TextInput } from "../../components/textInput";

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
  handleUpdatePerson: (person: Person) => void;
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
                  onSubmit: (person) => handleUpdatePerson(person),
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
  const { showModal, hideModal } = useContext(ModalContext);

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

  const handleDeletePerson = useCallback(
    (id: string) => {
      fetch(`${serverUrl}/users/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          setQuery("");
          setSortBy(undefined);
          setUsers(data.users);
          hideModal();
        });
    },
    [hideModal]
  );

  const handleUpdatePerson = useCallback(
    (updatedPerson: Person) => {
      console.log(updatedPerson);
      fetch(`${serverUrl}/users/${updatedPerson.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPerson),
      })
        .then((res) => res.json())
        .then((data) => {
          setQuery("");
          setSortBy(undefined);
          setUsers(data.users);
          hideModal();
        });
    },
    [hideModal]
  );

  const handleNewPerson = useCallback(
    (newPerson: Person) => {
      fetch(`${serverUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      })
        .then((res) => res.json())
        .then((data) => {
          setQuery("");
          setSortBy(undefined);
          setUsers(data.users);
          hideModal();
        });
    },
    [hideModal]
  );

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
        <TextInput
          label="Search:"
          placeholder="search query"
          name="query"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
        />

        {isEditor && (
          <div className="add-entry--wrapper">
            <button
              onClick={() =>
                showModal({
                  onSubmit: (person) => handleNewPerson(person),
                  type: "create",
                })
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
