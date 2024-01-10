
import React, { useCallback, useEffect, useState } from "react";
import { throttle, find } from "lodash";
import App from "./App";
import axios from "axios";

function Student({ socket, codeBlock }) {
  const [text, setText] = useState("");
  const [showLobbyPage, setShowLobbyPage] = useState(false);
  const [question, setQuestion] = useState([]);

  const leaveRoom = () => {
    socket.emit("leave-room", codeBlock);
    setShowLobbyPage(true);
  };

  const editText = async (text) => {
    const data = {
      text,
      room: codeBlock,
    };
    await socket.emit("edit_code", data);
  };
  const throttleEditText = useCallback(throttle(editText, 1000), [socket]);

  const clearTextarea = () => {
    socket.emit("clear_textArea");
    setText("");
  };

  socket.on("clear_textArea", () => {
    setText("");
  });

  useEffect(() => {
    socket.on("update_code", (text) => {
      setText(text);
    });

    return leaveRoom;
  }, []);

  useEffect(() => {
    if (!socket) return;
    throttleEditText(text);
  }, [text]);

  useEffect(() => {
    axios
      .get("live-chat-2qhg.vercel.app/getQuestion")
      .then((questions) => {
        const question = find(questions.data, { id: codeBlock });
        setQuestion(question);
        console.log(question);
      })
      .catch((err) => console.log(err));
  }, []);

  return !showLobbyPage ? (
    <div className="chat-window">
      <div className="chat-header">
        <p>Code block page - {codeBlock}</p>
      </div>
      <div className="mentor-zone">
        <p>Question:</p>
        <ul>{question.description}</ul>
      </div>
      <div className="chat-body">
        <div className="student-zone" id="code-editor">
          <textarea
            id="textArea"
            ty
            pe="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
      <div className="chat-footer">
        <button id="clearTextBtn" className="btn" onClick={clearTextarea}>
          Clear
        </button>
        <button id="leaveRoomBtn" className="btn" onClick={leaveRoom}>
          Leave room
        </button>
      </div>
    </div>
  ) : (
    <App />
  );
}

export default Student;
