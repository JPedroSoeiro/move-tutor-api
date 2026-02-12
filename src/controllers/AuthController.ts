import { Request, Response } from "express";
import { supabase } from "../services/supabase.js";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ message: "Usuário criado!", user: data.user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });

  const user = {
    id: data.session?.user.id,
    email: data.session?.user.email,
    full_name: data.session?.user.user_metadata?.full_name 
  };

  return res.json({ 
    message: "Logado!", 
    session: data.session,
    user: user 
  });
};