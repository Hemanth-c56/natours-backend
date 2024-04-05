import express from 'express';
import morgan from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import tourRouter from './routes/tourRoutes.js'
import userRouter from './routes/userRoutes.js'

const app = express();
//``````````````````````````````````all of the middle wares````````````````````````````

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

export default app;