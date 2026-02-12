import { Request, Response } from "express";
import { supabase } from "../services/supabase.js";

export const createTeam = async (req: Request, res: Response) => {
  const { userId, teamName, pokemons } = req.body; // pokemons é um array de objetos

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert([{ user_id: userId, team_name: teamName }])
    .select()
    .single();

  if (teamError) return res.status(400).json({ error: teamError.message });

  const pokemonsToInsert = pokemons.map((p: any, index: number) => ({
    team_id: team.id,
    pokemon_name: p.name,
    ability: p.ability,
    item: p.item,
    nature: p.nature,
    move_1: p.moves[0],
    move_2: p.moves[1],
    move_3: p.moves[2],
    move_4: p.moves[3],
    is_shiny: p.is_shiny,
    order_index: index
  }));

  const { error: pError } = await supabase.from('team_pokemons').insert(pokemonsToInsert);

  if (pError) return res.status(400).json({ error: pError.message });

  return res.status(201).json({ message: "Time salvo com sucesso!" });
};

export const getFeed = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      profiles (full_name),
      team_pokemons (*)
    `)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};