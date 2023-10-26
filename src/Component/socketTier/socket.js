import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_COUNTRY_KEY)

socket.on("connect", () => {
    console.log("connect");
})
socket.on("disconnect", () => {
    console.log("disconnect");
})
socket.on("backendResponse", (responce) => {
    console.log("backend socket connected", responce);
})
export default socket;     