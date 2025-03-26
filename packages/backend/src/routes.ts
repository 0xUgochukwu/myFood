import express from 'express';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.json({ message: 'Hello from myFood' });
});


export default routes;
