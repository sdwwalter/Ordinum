import { createClient } from '@/lib/supabase/server';

function getISOWeekKey(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7; // Monday=1..Sunday=7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`;
}

function prevWeekKey(weekKey: string) {
  const [y, w] = weekKey.split('-').map((v) => parseInt(v, 10));
  let year = y;
  let week = w - 1;
  if (week < 1) {
    year = y - 1;
    // approximate: ISO weeks can be 52 or 53 — safe fallback to 52
    week = 52;
  }
  return `${year}-${String(week).padStart(2, '0')}`;
}

export async function calcularStreakRevisao(workspace_id: string, user_id: string) {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('alinhamentos')
    .select('data')
    .eq('workspace_id', workspace_id)
    .eq('user_id', user_id)
    .eq('tipo', 'revisao_solo')
    .order('data', { ascending: false });

  if (error) return 0;

  const dates: Date[] = (rows || []).map((r: any) => new Date(r.data));

  // build weekKey set with tolerance: if a review is on Mon/Tue, it also counts for previous week
  const weekSet = new Set<string>();
  for (const d of dates) {
    const wk = getISOWeekKey(d);
    weekSet.add(wk);
    const day = d.getDay(); // 0 Sun .. 2 Tue
    if (day === 1 || day === 2) {
      // also count for previous week
      weekSet.add(prevWeekKey(wk));
    }
  }

  // determine current week key to check
  const today = new Date();
  const todayDay = today.getDay();
  const currentWeekKey = getISOWeekKey(today);
  const startWeekKey = (todayDay === 1 || todayDay === 2) ? prevWeekKey(currentWeekKey) : currentWeekKey;

  let streak = 0;
  let wk = startWeekKey;
  while (weekSet.has(wk)) {
    streak += 1;
    wk = prevWeekKey(wk);
  }

  return streak;
}
