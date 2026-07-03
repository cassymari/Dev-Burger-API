import dotenv from "dotenv";

dotenv.config();


import app from './app.js';
import './database/index.js';

app.listen(3001, () => console.log('Application is running at port 3001'));
0