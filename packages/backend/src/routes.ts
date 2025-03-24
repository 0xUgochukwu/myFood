import express from 'express';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.json({ message: 'Hello from myFoodApp' });

});


export default routes;
