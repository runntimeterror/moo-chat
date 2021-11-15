import React, { useState } from "react";
import { get } from 'lodash'
import "./home.scss";
import { Link } from "react-router-dom";

function Homepage(props) {
  const [roomname, setroomname] = useState("");

  return (
    <div className="homepage">
      <h1>MooChat - {get(props, `user.attributes.given_name`)}</h1>
      <input
        placeholder="Input the room name"
        value={roomname}
        onChange={(e) => setroomname(e.target.value)}
      ></input>
      <Link to={`/chat/${roomname}/${props.user.attributes.given_name}`}>
        <button>Join</button>
      </Link>
    </div>
  );
}

export default Homepage;
