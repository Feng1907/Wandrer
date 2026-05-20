import 'dotenv/config';
import http from 'http';
import app from './app';
import { initSocket } from './utils/socket';
import { startBookingTimeoutJob } from './jobs/bookingTimeout.job';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);
startBookingTimeoutJob();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
