import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

dotenv.config();

const swaggerFile = JSON.parse(fs.readFileSync('./src/swagger.json', 'utf8'));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Move Tutor API Online! 🚀' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server]: Rodando em http://localhost:${PORT}`);
});