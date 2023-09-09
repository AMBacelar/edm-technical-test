import React, { SyntheticEvent, useEffect, useState } from "react";
import "./styles.css";
import { useAuth } from "../../hooks/useAuth";
import { TextInput } from "../../components/textInput";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  // password validation
  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (password.match(/[$&+,:;=?@#|'<>.^*()%!_-]/) === null) {
      errors.push("Password must contain at least one special character");
    }
    if (password.match(/[a-z]/) === null) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (password.match(/[A-Z]/) === null) {
      errors.push("Password must contain at least one uppercase letter");
    }

    return errors;
  };
  useEffect(() => {
    const errors = validatePassword(password);
    setErrors(errors);
    setIsValid(errors.length === 0);
  }, [password]);

  const { login } = useAuth();

  // form submission
  const onSubmit = (
    e: SyntheticEvent<HTMLButtonElement> | SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const payload = {
      username,
      password,
    };
    console.log("sending to endpoint", payload);
    login({ username });
  };

  return (
    <div className="App">
      <div className="App-header">
        <form name="login-form" onSubmit={onSubmit} className="login-form">
          <TextInput
            label="Username"
            placeholder="Enter Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {password.length > 0 && errors.length > 0 && (
            <div className="error-message">
              Any password will do, just make sure to follow these rules:
              <ul>
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={`mt-10 button ${isValid && "blue"}`}
            disabled={!isValid}
            onClick={(e) => onSubmit(e)}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
