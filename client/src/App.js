import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Student from "./Student";
import Mentor from "./Mentor";

const socket = io.connect("http://localhost:3001");

function App() {
  const [codeBlock, setCodeBlock] = useState("");
  const [showStudentPage, setShowStudentPage] = useState(false);
  const [showMentorPage, setShowMentorPage] = useState(false);

  let amountUsers = 0;

  const joinRoom = () => {
    var numberOfChatButtons =
      document.querySelectorAll(".optionChatButton").length;
    for (var i = 0; i < numberOfChatButtons; i++) {
      document
        .querySelectorAll(".optionChatButton")[i].addEventListener("click", function () {
          var tmpRoom = this.innerHTML;
          if (tmpRoom !== "") {
            socket.emit("join_room", tmpRoom, (response) => {
              if (response === "Mentor") {
                setShowMentorPage(true);
              } else if (response === "Student") {
                setShowStudentPage(true);
              }
              setCodeBlock(tmpRoom);
            });
          }
        });
    }
  };

  return (
    <div className="App">
      {!showMentorPage && !showStudentPage ? (
        <div className="joinChatContainer">
          <h3>Lobby page</h3>
          <button className="optionChatButton" onClick={joinRoom}>
            Multiples 3 or 5
          </button>
          <button className="optionChatButton" onClick={joinRoom}>
            Even Fibonacci Numbers  
          </button>
          <button className="optionChatButton" onClick={joinRoom}>
            100001st Prime
          </button>
          <button className="optionChatButton" onClick={joinRoom}>
            Summation of Primes
          </button>
        </div>
      ) : showMentorPage ? (
        <Mentor socket={socket} codeBlock={codeBlock}/>
      ) : showStudentPage && ( 
        <Student socket={socket} codeBlock={codeBlock} />
      )}
    </div>
  );
}

export default App;
