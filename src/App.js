import Chat from "./chat/chat";
import Home from "./home/home";
import { isEmpty } from 'lodash'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const LOCAL_SERVER = `http://localhost:8000`
const SOCKET_SERVER = `http://0bf8-2600-1700-4a30-d5c0-dcda-2de7-befc-ceb6.ngrok.io`
const socket = io(SOCKET_SERVER);
function Appmain(props) {
  return (
    <React.Fragment>
      <Chat
        username={props.match.params.username}
        roomname={props.match.params.roomname}
        socket={socket}
      />
    </React.Fragment>
  );
}

function App() {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState({});

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID")
    if (sessionID) {
      socket.auth = { sessionID };
    }
    socket.on("session", ({ sessionID, userID }) => {
      socket.auth = { sessionID }
      localStorage.setItem("sessionID", sessionID)
      socket.userID = userID
    })

    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
      if (authData.attributes && nextAuthState === AuthState.SignedIn) {
        socket.auth = Object.assign({}, socket.auth, {
          username: authData.attributes.given_name,
          userId: authData.username
        })
        socket.connect()
      }
    });
  }, []);

  const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '10px',
    // you can also just use 'scale'
    transition: transitions.SCALE
  }

  return authState === AuthState.SignedIn && !isEmpty(user) ? (
    <div className="App">
      <Router>
        <AlertProvider template={AlertTemplate} {...options}>
          <div className="App">
            <Switch>
              <Route path="/" exact>
                <Home user={user} />
              </Route>
              <Route path="/chat/:roomname/:username"
                render={(props) => {
                  return <Appmain {...props} user={user} />
                }} />
            </Switch>
          </div>
        </AlertProvider>
      </Router>
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" },
          { type: "family_name", label: "Last Name *", required: true },
          { type: "given_name", label: "First Name *", required: true },
        ]}
      />
    </AmplifyAuthenticator>
  );
}

export default App;
