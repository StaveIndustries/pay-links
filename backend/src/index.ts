import cors from 'cors';
import express from 'express';
import { linksRouter } from './routes/links.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/links', linksRouter);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`pay-links backend on http://localhost:${port}`);
});
