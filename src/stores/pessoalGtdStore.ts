import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Contexto = 'empresa' | 'produto' | 'marketing' | 'pessoal' | 'dados';

export interface GtdTask {
  id: string;
  titulo: string;
  done: boolean;
  contexto: Contexto;
  hora?: string; // "14:30"
  dia: 'hoje' | 'proximos';
}

interface PomodoroState {
  running: boolean;
  seconds: number; // remaining
  tarefaFocoId: string | null;
}

interface PessoalGtdState {
  tasks: GtdTask[];
  pomodoro: PomodoroState;

  toggleTask: (id: string) => void;
  addTask: (t: Omit<GtdTask, 'id'>) => void;
  removeTask: (id: string) => void;
  startPomodoro: (tarefaId: string) => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
}

const SEED_TASKS: GtdTask[] = [
  { id: 'g1', titulo: 'Preparar slides para 1:1 com diretor', done: false, contexto: 'empresa',   hora: '09:00', dia: 'hoje' },
  { id: 'g2', titulo: 'Revisar proposta comercial - cliente B', done: true,  contexto: 'empresa',   hora: '11:00', dia: 'hoje' },
  { id: 'g3', titulo: 'Sync com time de produto — Sprint 12', done: false, contexto: 'produto',   hora: '14:00', dia: 'hoje' },
  { id: 'g4', titulo: 'Lançar campanha no LinkedIn',           done: false, contexto: 'marketing', hora: '16:00', dia: 'hoje' },
  { id: 'g5', titulo: 'Validar orçamento Q3 com CFO',          done: false, contexto: 'empresa',   hora: '',      dia: 'proximos' },
  { id: 'g6', titulo: 'Pesquisar fornecedores de design',      done: false, contexto: 'produto',   hora: '',      dia: 'proximos' },
  { id: 'g7', titulo: 'Reunião com investidores',              done: false, contexto: 'empresa',   hora: '10:00', dia: 'proximos' },
];

export const usePessoalGtdStore = create<PessoalGtdState>()(
  immer((set) => ({
    tasks: SEED_TASKS,
    pomodoro: {
      running: false,
      seconds: 23 * 60 + 47, // 23:47 como no design
      tarefaFocoId: 'g1',
    },

    toggleTask: (id) => set((state) => {
      const t = state.tasks.find((t) => t.id === id);
      if (t) t.done = !t.done;
    }),

    addTask: (t) => set((state) => {
      state.tasks.push({ ...t, id: crypto.randomUUID() });
    }),

    removeTask: (id) => set((state) => {
      state.tasks = state.tasks.filter((t) => t.id !== id);
    }),

    startPomodoro: (tarefaId) => set((state) => {
      state.pomodoro.running = true;
      state.pomodoro.tarefaFocoId = tarefaId;
    }),

    pausePomodoro: () => set((state) => {
      state.pomodoro.running = false;
    }),

    resetPomodoro: () => set((state) => {
      state.pomodoro = { running: false, seconds: 25 * 60, tarefaFocoId: null };
    }),

    tickPomodoro: () => set((state) => {
      if (state.pomodoro.running && state.pomodoro.seconds > 0) {
        state.pomodoro.seconds -= 1;
      } else if (state.pomodoro.seconds === 0) {
        state.pomodoro.running = false;
      }
    }),
  }))
);
