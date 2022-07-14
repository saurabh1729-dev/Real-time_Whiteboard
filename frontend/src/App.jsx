
import './App.css'
import {Routes, Route} from "react-router-dom"
import Forms from './Components/Forms'
import RoomPage from './pages/RoomPage'
import io from "socket.io-client"
import { useState, useEffect } from 'react'
import {toast, ToastContainer} from 'react-toastify';

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);


const App = ()=> {

  // const [userNo, setUserNo] = useState(0);
  // const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("userIsJoined")
        setUsers(data.users);
      }else{
        console.log("userJoined Error")
      }
    });

    socket.on("allUsers",data=>{
      setUsers(data);
    });

    socket.on("userJoinedMessageBroadcasted",(data)=>{
      toast.info(`${data} joined the room`);
    })

    socket.on("userLeftMessageBroadcasted",(data)=>{

      toast.info(`${data} left the room`);

    })

  }, []);


  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <div className="container">
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid}  socket={socket} setUser={setUser}/>}/>
        <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users}/>}/>
      </Routes>
    </div>
  )
}

export default App
