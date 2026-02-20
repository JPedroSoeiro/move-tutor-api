import { Request, Response } from 'express';
import { supabase } from '../services/supabase.js';

// Interface estendida para reconhecer o usuário injetado pelo middleware de autenticação
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    user_metadata?: {
      full_name?: string;
    };
  };
}

export const createTeam = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Log para você ver no terminal da API o que está vindo no metadata
    console.log("METADATA DO USUARIO:", user?.user_metadata);

    const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || "Treinador";

    const { data, error } = await supabase
      .from('teams')
      .insert([{ 
          ...req.body, 
          user_id: user.id, 
          author_name: userName 
      }])
      .select();

    if (error) {
      console.error("ERRO SUPABASE AO SALVAR:", error);
      return res.status(400).json(error);
    }

    return res.status(201).json(data[0]);
  } catch (error: any) {
    console.error("ERRO CRITICO:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    // 1. Verifique se o nome da tabela está correto ('teams')
    // 2. Remova qualquer .eq() que possa estar filtrando os resultados
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    // 3. Log no terminal do Back-end para ver o que o banco respondeu
    console.log("Times encontrados no banco:", data?.length);

    return res.json(data || []); 
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // O ID vem da URL
    const userId = (req as any).user?.id; // ID do usuário vindo do middleware

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.status(204).send(); // Sucesso sem conteúdo
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getUserTeams = async (req: Request, res: Response) => {
  const { username } = req.params;
  
  const { data, error, count } = await supabase
    .from('teams')
    .select('*', { count: 'exact' })
    .eq('author_name', username) 
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  
  // Retorna o objeto exatamente como o Front-end espera consumir
  return res.json({
    teams: data,
    count: count || 0,
    username: username
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('author_name')
      .not('author_name', 'eq', 'Treinador Desconhecido'); 

    const uniqueUsers = [...new Set(data?.map(item => item.author_name).filter(Boolean))];
    return res.json(uniqueUsers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};