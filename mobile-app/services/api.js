import axios from 'axios';

export default axios.create({
  baseURL: 'http://172.25.49.193:5001/api/auth'
});