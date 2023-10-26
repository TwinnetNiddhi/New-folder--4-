import io from 'socket.io-client';
import Cookies from 'universal-cookie';

const cookies = new Cookies(); // Create an instance of Cookies

let token = cookies.get('token');
// const data_Token = useSelector(state => state?.authReducer?.token)
// Define the headers with the Authorization header

const socket = io(process.env.REACT_APP_SOCKET, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  // extraHeaders: headers, // Pass the headers here
  auth: {
    token: `Bearer ${token}`, // Replace with your JWT token
  },
});

socket.on('connect', () => {
  console.log('Connected to backend socket');

  socket.on('disconnect', () => {
    console.log('Disconnected from backend socket');
  });

  socket.on('backendResponse', (data) => {
    console.log('Received data from backend:', data);
  });
});

export default socket;


export const setupSocket = (token) => {
  const socket = io(process.env.REACT_APP_SOCKET, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    auth: {
      token: `Bearer ${token}`, // Use the provided token
    },
  });

  socket.on('connect', () => {
    console.log('Connected to backend socket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from backend socket');
  });

  socket.on('backendResponse', (data) => {
    console.log('Received data from backend:', data);
  });

  return socket;
};

