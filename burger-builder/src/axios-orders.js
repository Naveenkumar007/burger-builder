import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://react-my-demo.firebaseio.com/'
});

export default instance;
