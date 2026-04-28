'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fonte (opcional, mas recomendado para evitar problemas de caractere)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#111827',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    padding: 8,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#4b5563',
  },
  value: {
    fontSize: 11,
    color: '#111827',
    fontWeight: 'bold',
  },
  valuePositive: {
    fontSize: 11,
    color: '#059669', // emerald
    fontWeight: 'bold',
  },
  valueNegative: {
    fontSize: 11,
    color: '#dc2626', // red
    fontWeight: 'bold',
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#475569',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af'
  }
});

interface RelatorioPDFProps {
  workspaceNome: string;
  mesRef: string;
  dados: {
    pessoal: { receitas: number, despesas: number };
    empresas: { id: string, nome: string, receitas: number, despesas: number }[];
    projetos: { nome: string, status: string, progresso: number, roi: number | null }[];
    acoes: { descricao: string, prazo: string | null }[];
  }
}

export const RelatorioPDF = ({ workspaceNome, mesRef, dados }: RelatorioPDFProps) => {
  const formatMoeda = (val: number) => `R$ ${val.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  const saldoPessoal = dados.pessoal.receitas - dados.pessoal.despesas;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório Executivo</Text>
          <Text style={styles.subtitle}>{workspaceNome} | Mês de Referência: {mesRef}</Text>
        </View>

        {/* 1. MÓDULO PESSOAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Finanças Pessoais</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total de Receitas</Text>
            <Text style={styles.valuePositive}>{formatMoeda(dados.pessoal.receitas)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total de Despesas (Gasto Pessoal)</Text>
            <Text style={styles.valueNegative}>{formatMoeda(dados.pessoal.despesas)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Saldo Mensal Pessoal</Text>
            <Text style={saldoPessoal >= 0 ? styles.valuePositive : styles.valueNegative}>
              {formatMoeda(saldoPessoal)}
            </Text>
          </View>
        </View>

        {/* 2. MÓDULO EMPRESA (DRE Simples) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Resultados Empresariais (DRE)</Text>
          {dados.empresas.length === 0 ? (
            <Text style={styles.label}>Nenhuma movimentação registrada.</Text>
          ) : (
            dados.empresas.map((emp, i) => {
              const res = emp.receitas - emp.despesas;
              return (
                <View key={i} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Empresa: {emp.nome || 'Principal'}</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Faturamento</Text>
                    <Text style={styles.valuePositive}>{formatMoeda(emp.receitas)}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Despesas + Custos</Text>
                    <Text style={styles.valueNegative}>{formatMoeda(emp.despesas)}</Text>
                  </View>
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>Resultado Líquido</Text>
                    <Text style={res >= 0 ? styles.valuePositive : styles.valueNegative}>
                      {formatMoeda(res)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* 3. MÓDULO PROJETOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Status dos Projetos</Text>
          {dados.projetos.length === 0 ? (
            <Text style={styles.label}>Nenhum projeto ativo.</Text>
          ) : (
            dados.projetos.map((proj, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.label}>{proj.nome} ({proj.status})</Text>
                <Text style={styles.value}>
                  {proj.roi !== null ? `ROI: ${proj.roi.toFixed(1)}%` : `Investido: ${proj.progresso.toFixed(0)}%`}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* 4. MÓDULO ALINHAMENTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Plano de Ação Pendente</Text>
          {dados.acoes.length === 0 ? (
            <Text style={styles.label}>Nenhuma ação pendente.</Text>
          ) : (
            dados.acoes.map((acao, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.label}>• {acao.descricao}</Text>
                <Text style={styles.value}>{acao.prazo ? `Prazo: ${acao.prazo}` : '-'}</Text>
              </View>
            ))
          )}
        </View>

        {/* RODAPÉ */}
        <Text style={styles.footer} fixed>
          Gerado pelo Sistema Ordinum SCLC-G
        </Text>

      </Page>
    </Document>
  );
};
