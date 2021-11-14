import Chat from "./chat/chat";
import Home from "./home/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

function Appmain(props) {
  const socket = io.connect('http://localhost:8000');
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
  const [user, setUser] = useState();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <AmplifySignOut />
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/chat/:roomname/:username" component={Appmain} />
          </Switch>
        </div>
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
          { type: "family_name", label: "Last Name *", required: true},
          { type: "given_name", label: "First Name *", required: true},
        ]}
      />
    </AmplifyAuthenticator>
  );
}

export default App;
