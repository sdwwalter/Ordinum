import { redirect } from 'next/navigation';

// Dashboard antigo → redireciona para nova Visão Geral
export default function DashboardRedirect() {
  redirect('/app/visao-geral');
}
