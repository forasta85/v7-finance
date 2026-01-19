import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Criar uma única instância do cliente Supabase (singleton)
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
