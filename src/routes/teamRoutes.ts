import { Router } from 'express';
import { createTeam, getFeed } from '../controllers/TeamController.js';

const router = Router();

router.post('/save', createTeam); 
router.get('/feed', getFeed);

export default router; 