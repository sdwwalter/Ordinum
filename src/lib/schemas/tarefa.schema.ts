import { z } from 'zod';

export const GtdContextoEnum = z.enum([
  '@computador', '@telefone', '@campo',
  '@reuniao', '@email', '@qualquer'
]);

export const TarefaSchema = z.object({
  titulo:         z.string().min(1),
  descricao:      z.string().optional(),
  responsavel_id: z.string().uuid().optional(),
  status:         z.enum(['pendente','em_andamento','concluida','bloqueada']),
  data_prevista:  z.string().optional(),
  contexto:       GtdContextoEnum.optional(),
  is_next_action: z.boolean().default(false),
  aguardando_de:  z.string().optional(),
});

export const GtdInboxSchema = z.object({
  conteudo: z.string().min(1, 'Captura não pode ser vazia'),
});
