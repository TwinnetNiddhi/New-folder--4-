
import io from 'socket.io-client';
import Cookies from 'universal-cookie';

const cookies = new Cookies(); // Create an instance of Cookies

let token = cookies.get('token');

const socketData = io(process.env.REACT_APP_SOCKET_APP_SECOUND_EVENT, {
  extraHeaders: {
    authorization: `Bearer ${cookies.get('token')}`,
  },
  methods: ['GET', 'POST'],
  transports: ['websocket', 'polling'],
  reconnect: true,
 // path: ':2122/socket.io'
});

socketData.on('connect', () => {
  console.log('Connected to backend socketData');
});

socketData.on('disconnect', () => {
  console.log('Disconnected from backend socketData');
});

socketData.on('backendResponse', (data) => {
  console.log('Received data from backend:', data);
});
export default socketData;