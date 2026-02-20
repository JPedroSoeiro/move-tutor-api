import { Router } from 'express';
import { 
  createTeam, 
  getAllTeams, 
  deleteTeam, 
  getUserTeams,
  getAllUsers
} from '../controllers/TeamController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// 1. FEED PÚBLICO: Remova o 'authenticate' para resolver o erro 401
router.get('/feed', getAllTeams); 

// 2. BUSCA POR USUÁRIO: Adicione esta rota para resolver o erro 404
// Esta rota também deve ser pública para o 'Search' funcionar para todos
router.get('/user/:username', getUserTeams);

router.get('/users/list', getAllUsers);

// 3. ROTAS PROTEGIDAS: Mantêm o login obrigatório
router.post('/save', authenticate, createTeam);

router.delete('/:id', authenticate, deleteTeam);


export default router;