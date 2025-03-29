import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import db from './utils/db';
import routes from './routes';
dotenv.config();


import userRoute from './modules/users/user.route';

const server = express();

server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

server.use('/api', routes);
server.use('/api/users', userRoute);


db.connect();

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
