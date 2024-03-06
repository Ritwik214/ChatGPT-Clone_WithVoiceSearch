
import { useState, useEffect } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
const createNewChat = () => {
  setMessage(null)
  setValue("")
  setCurrentTitle(null)
}

const handleClick = (uniqueTitle) => {
setCurrentTitle(uniqueTitle)
setMessage(null)
setCurrentTitle("")
}

const startVoiceRecognition = () => {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const recognizedText = event.results[0][0].transcript;
    setValue(recognizedText);
  };

  recognition.start();
};

  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
        message: value,
      }),
       headers: {
        "Content-Type": "application/json"
       }
    }
    try{
       const respone = await fetch('http://localhost:8000/completions', options)
       const data = await respone.json()
       setMessage(data.choices[0].message)
    } catch(error){
      console.error(error)
    }
  }


useEffect(() => {
console.log(currentTitle, value, message)
if(!currentTitle && value && message){
  setCurrentTitle(value)
}
if(currentTitle && value && message){
  setPreviousChats(prevChats => (
    [...prevChats, {
     title: currentTitle,
     role: "user",
     content: value
    },{
      title: currentTitle,
       role: message.role,
       content: message.content
    }]
  ))
}
}, [message, currentTitle])

console.log(previousChats)

const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)

const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index)=><li key={index} onClick={() => handleClick(uniqueTitles)}>{uniqueTitles}</li>)}
        </ul>
        <nav>
          <p>Made By Ritwik</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ChatGPT-Clone</h1>}
        <ul className="feed">
             {currentChat?.map((chatMessage, index)=> <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
             </li>)}
        </ul>
        <div className="bottom-section">
        <div className="input-container">
  <input value={value} onChange={(e) => setValue(e.target.value)} />
  <div className="icons-container">
    <div id="submit" onClick={getMessages}>🏹</div>
    <div id="voice-search" onClick={startVoiceRecognition}>🎙️</div>
  </div>
</div>

          <p className="info">
          Free Research Preview.
          ChatGPT may produce inaccurate information about people, places, or facts.
          ChatGPT August 3 Version
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
