import { supabase } from "../config/supabaseClient";

const TABLE_NAME = 'rutinas';

export const getRutinas = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) throw error;
  return data;
};

export const getRutinaById = async (id) => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createRutina = async (rutina) => {
  const { data, error } = await supabase.from(TABLE_NAME).insert([rutina]).select();
  if (error) throw error;
  return data[0];
};

export const updateRutina = async (id, rutina) => {
  const { data, error } = await supabase.from(TABLE_NAME).update(rutina).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteRutina = async (id) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  if (error) throw error;
};