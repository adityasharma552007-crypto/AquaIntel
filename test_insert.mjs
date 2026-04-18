import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...ver] = line.split('=');
  if (key && ver.length) acc[key.trim()] = ver.join('=').trim().replace(/"/g, '');
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('water_data').insert({ quality: 0.85, status: 'Pure' }).select();
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
