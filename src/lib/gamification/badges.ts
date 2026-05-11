import type { GamificationStats } from './types';

export const GTD_BADGES = [
  {
    id: 'mente_limpa',
    nome: 'Mente Limpa',
    descricao: 'Zerou o inbox pela primeira vez',
    icone: '🧠',
    condicao: (stats: GamificationStats) => (stats.inbox_zerado_count || 0) >= 1,
    raro: false,
  },
  {
    id: 'consistencia_4',
    nome: 'Consistência',
    descricao: '4 revisões semanais consecutivas',
    icone: '🔄',
    condicao: (stats: GamificationStats) => (stats.revisao_streak || 0) >= 4,
    raro: false,
  },
  {
    id: 'consistencia_12',
    nome: 'Disciplina',
    descricao: '12 revisões semanais consecutivas',
    icone: '🏆',
    condicao: (stats: GamificationStats) => (stats.revisao_streak || 0) >= 12,
    raro: true,
  },
  {
    id: 'executor',
    nome: 'Executor',
    descricao: '10 próximas ações concluídas',
    icone: '⚡',
    condicao: (stats: GamificationStats) => (stats.next_actions_concluidas || 0) >= 10,
    raro: false,
  },
  {
    id: 'arquiteto',
    nome: 'Arquiteto',
    descricao: '5 projetos concluídos com ROI calculado',
    icone: '🏗️',
    condicao: (stats: GamificationStats) => (stats.projetos_com_roi || 0) >= 5,
    raro: true,
  },
  {
    id: 'visionario',
    nome: 'Visionário',
    descricao: 'Ativou 3 projetos do Algum Dia',
    icone: '🔭',
    condicao: (stats: GamificationStats) => (stats.algum_dia_ativados || 0) >= 3,
    raro: false,
  },
];

export type BadgeDef = typeof GTD_BADGES[number];
