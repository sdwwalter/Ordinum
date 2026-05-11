export const GTD_EVENTOS = {
  INBOX_ZERADO: { tipo: 'inbox_zerado', pontos: 10 },
  ITEM_CAPTURADO: { tipo: 'item_capturado', pontos: 1 },
  ITEM_PROCESSADO: { tipo: 'item_processado', pontos: 2 },
  NEXT_ACTION_CONCLUIDA: { tipo: 'next_action_concluida', pontos: 5 },
  REVISAO_SEMANAL_COMPLETA: { tipo: 'revisao_semanal_completa', pontos: 25 },
  PROJETO_COM_NEXT_ACTION: { tipo: 'projeto_com_next_action', pontos: 3 },
  PROJETO_CONCLUIDO_COM_ROI: { tipo: 'projeto_concluido_roi', pontos: 50 },
  ALGUM_DIA_ATIVADO: { tipo: 'algum_dia_ativado', pontos: 5 },
} as const;

export type GtdEventoKey = keyof typeof GTD_EVENTOS;
