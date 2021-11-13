import "./chat.scss";
import { to_Decrypt, to_Encrypt } from "../aes.js";
import { process } from "../store/action/index";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

function Chat({ username, roomname, socket }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher));
  };

  useEffect(() => {
    socket.on("message", (data) => {
      //decypt
      let temp = messages;
      if (data.payload.text) {
        const ans = to_Decrypt(data.payload.text, data.username);
        dispatchProcess(false, ans, data.payload.text);
        console.log(ans);
        temp.push({
          userId: data.userId,
          username: data.username,
          text: ans,
        });
      } else if (data.payload.image) {
        temp.push({
          userId: data.userId,
          username: data.username,
          image: data.payload.image,
        });
      }
      setMessages([...temp]);
    });
  }, [socket]);

  const onImageChange = (event) => {
    //check image moderation server
    const file = event.target.files[0]
    var reader = new FileReader();
    reader.onload = function (e) {
      // binary data
      socket.emit("chat", { image: e.target.result });
    };
    reader.onerror = function (e) {
      // error occurred
      console.log('Error : ' + e.type);
    };
    if (file)
      reader.readAsDataURL(file);
  }

  const sendData = () => {
    if (text !== "") {
      //encrypt here
      const ans = to_Encrypt(text);
      socket.emit("chat", { text: ans });
      setText("");
    }
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat">
      <div className="user-name">
        <h2>
          {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
        </h2>
      </div>
      <div className="chat-message">
        {messages.map((i) => {
          if (i.username === username) {
            return (
              <div className="message">
                {i.text ? <p>{i.text}</p> : null}
                {i.image ? <p><img width={150} src={i.image}></img></p> : null}
                <span>{i.username}</span>
              </div>
            );
          } else {
            return (
              <div className="message mess-right">
                <p>{i.text} </p>
                <span>{i.username}</span>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="send">

        <input
          placeholder="enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        />
        <div>
          <label htmlFor='chatImage'>
            <i className="fas fa-images attach-images"></i>
          </label>
          <input type="file"
            className="image-input"
            id="chatImage"
            accept="image/png, image/jpeg"
            name="chatImage"
            onChange={onImageChange} />
        </div>
        <button onClick={sendData}>Send</button>
      </div>
    </div>
  );
}
export default Chat;
