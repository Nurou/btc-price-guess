import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDB } from './db';
import { playerRouter } from './routes/player-routes';
import { guessRouter } from './routes/guess-routes';
import { priceRouter } from './routes/price-routes';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connectToDB();

app.use('/api/player', playerRouter);
app.use('/api/guess', guessRouter);
app.use('/api', priceRouter);

app.use('/api/health-check', (req, res) => {
  res.status(200).send('OK');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinGame', (playerId) => {
    socket.join(playerId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
