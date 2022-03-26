import React, { useState, useEffect } from "react";
import Picture from "./images/market.png";
import Picture2 from "./images/market2.jpg";
import ChatIcon from "./images/chat-icon.png";
import Ping from "./audio/ping.mp3";
import Error from "./audio/error.mp3"


import "./App.css";

function App() {
  const [messageData, setMessageData] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("Main");
  const [input, setInput] = useState(
    { user: "" },
    { messageBody: "" },
    { room: "" }
  );

  function handleChange(event) {
    let newInput = {
      ...input,
      [event.target.name]: event.target.value,
      room: currentRoom,
    };
    setInput(newInput);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let checkInputArray = input.messageBody.split("");
    if (checkInputArray.length <= 500) {
      let clearInput = { ...input, messageBody: "" };
      setInput(clearInput);

      let pingAudio = new Audio(Ping);
      pingAudio.play();

      await fetch("http://localhost:8000/add-message", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(input),
      });
    } else {
      let errorAudio = new Audio(Error);
      errorAudio.play()

      alert("Woah woah woah, take it easy mate! 500 characters or less!");
    }
  }

  async function getData() {
    let allMessagesArray = [];
    let allMessages = await fetch("http://localhost:8000/get-all-messages");
    allMessages = await allMessages.json();
    allMessages.forEach((message) => {
      allMessagesArray.push(message);
    });
    setMessageData(allMessagesArray.reverse());
  }

  useEffect(() => {
    const fetchNewData = () => {
      getData();
      setTimeout(fetchNewData, 0);
    };
    setTimeout(fetchNewData, 0);
  }, []);

  let images = [Picture, Picture2];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentImage === images.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentImage, images.length]);

  return (
    <main>
      <header id="header">
        <h1>React Chat</h1>
        <img src={ChatIcon} alt="some chat bubbles" />
      </header>
      <div id="body-container">
        <div id="left-screen">
          <div id="rooms">
            <h3>Available Rooms</h3>
              <ul id="room-selection">
                <li className={`wrapper searchDiv ${currentRoom === "Main" ? "selected" : ""}`} onClick={() => setCurrentRoom("Main")}>Main</li>
                <li className={`wrapper searchDiv ${currentRoom === "Pets" ? "selected" : ""}`} onClick={() => setCurrentRoom("Pets")}>Pets</li>
                <li className={`wrapper searchDiv ${currentRoom === "Food" ? "selected" : ""}`} onClick={() => setCurrentRoom("Food")}>Food</li>
              </ul>
          </div>
          <div id="market-space">
            <img src={images[currentImage]} alt="marketers" />
          </div>
        </div>

        <div id="right-screen">
          <div id="current-room">
            <h3>{currentRoom}</h3>
          </div>

          <div id="chat-box-and-buttons">
        
              <div id="chat-box">
                {messageData.map((message) => {
                  if (message.room === currentRoom) {
                    return (
                      <>
                        <div className="message-input">
                          <h2>
                            <span>{message.user}</span> says:
                          </h2>
                          <p>{message.messageBody}</p>
                          <h3>Time: {message.when}</h3>
                        </div>
                      </>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
  

            <div id="input-forms">
              <form onSubmit={handleSubmit}>
                <label>
                  <input
                    id="username-input"
                    type="text"
                    name="user"
                    value={input.user}
                    placeholder="User Name"
                    onChange={handleChange}
                  />
                </label>

                <label>
                  <textarea
                    id="message-input"
                    name="messageBody"
                    value={input.messageBody}
                    placeholder="Message: (500 characters or less)"
                    onChange={handleChange}
                  ></textarea>
                </label>
                <button id="submit-button" type="submit" value="Enter">
                  Enter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
