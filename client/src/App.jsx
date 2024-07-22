import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [usernameRegister, setUsernameRegister] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [data, setData] = useState(null);
  const [registerLayout, setRegisterLayout] = useState(false);

  useEffect(() => {
    setAccessToken(localStorage.getItem("_login_token"));
  }, []);

  useEffect(() => {
    if (data && data.username !== "") {
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    if (accessToken !== "") {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      fetch("http://localhost:8000/api/users/current", requestOptions)
        .then((response) => response.json())
        .then((response) => 
        {
          console.log(response);
          setData(response)
        }
      );
    }
  }, [accessToken]);

  const handleLogin = () => {
    const requestOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email: email, password: password }),
    };
    fetch("http://localhost:8000/api/users/login", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        setAccessToken(response.accessToken);
        localStorage.setItem("_login_token", response.accessToken);
      }
    );
  };

  const handleLogout = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken, userID: data.id }),
    };
    fetch("http://localhost:8000/api/users/logout",requestOptions)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .then(setAccessToken(""))
    .then(setData(null))
    .then(localStorage.setItem("_login_token",null))
  }
  const handleRegister = () => {
    const requestOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username:usernameRegister,email: emailRegister, password: passwordRegister }),
    };
    fetch("http://localhost:8000/api/users/register",requestOptions)
    .then((response) => response.json())
    .then((response) => console.log(response))
  }

  return (
    <div className="App">
      {data !== null && !data?.hasOwnProperty('message') ? (
        <>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          {!registerLayout ? (
            <div>
              <h1>Login</h1>
              <input
                id="emailInput"
                type="text"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              <input
                id="passwordInput"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setRegisterLayout(true) }>Create Account</button>
            </div>
          ):(
            <div>
              <h1>Register</h1>
              <input
                id="usernameInputRegister"
                type="text"
                placeholder="username"
                onChange={(e) => setUsernameRegister(e.target.value)}
                autoComplete="off"
              />
              <input
                id="emailInputRegister"
                type="text"
                placeholder="email"
                onChange={(e) => setEmailRegister(e.target.value)}
                autoComplete="off"
              />
              <input
                id="passwordInputRegister"
                type="password"
                placeholder="password"
                onChange={(e) => setPasswordRegister(e.target.value)}
                autoComplete="off"
              />
              <button onClick={handleRegister}>Register</button>
              <button onClick={() => setRegisterLayout(false) }>Already have a Account</button>
            </div>
          )}
          
        </>
      )}
    </div>
  );
}

export default App;
