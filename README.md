# 🏜️ DUNA — Marketplace de Aluguel por Temporada

Marketplace de aluguel por temporada **100% funcional**, construído com **Supabase** como backend completo.

## ✨ O que é o DUNA?

DUNA é um marketplace completo de aluguel por temporada, similar ao Airbnb, com:

- ✅ **Autenticação real** (Supabase Auth)
- ✅ **Banco de dados real** (PostgreSQL via Supabase)
- ✅ **Upload de imagens real** (Supabase Storage)
- ✅ **Chat em tempo real** (Supabase Realtime)
- ✅ **Sistema de reservas completo**
- ✅ **Pagamentos prontos para Stripe**
- ✅ **Sistema de comissões configurável**
- ✅ **Avaliações bidirecionais**
- ✅ **Programa de fidelidade**
- ✅ **Sistema de afiliados**
- ✅ **Painel do anfitrião**
- ✅ **Painel administrativo**
- ✅ **Row Level Security (RLS)** para segurança de dados

## 🏗️ Arquitetura

### Frontend
- **React 18** + **TypeScript**
- **Vite** para build
- **Tailwind CSS 4** para estilos
- **Framer Motion** para animações
- **React Router** com HashRouter
- **Recharts** para gráficos

### Backend (Supabase)
- **PostgreSQL** — Banco de dados relacional
- **Supabase Auth** — Autenticação completa
- **Supabase Storage** — Upload de imagens
- **Supabase Realtime** — Chat em tempo real
- **Row Level Security** — Segurança por linha
- **Edge Functions** — Webhooks e lógica serverless

### Integrações (opcionais)
- **Stripe** — Pagamentos e split de comissão
- **Google Maps** — Mapa interativo
- **Resend** — Emails transacionais

## 🚀 Quick Start

### 1. Clonar e instalar

```bash
git clone <repository>
cd duna
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute `supabase/schema.sql` no SQL Editor
3. Crie os buckets de storage (property-images, avatars, documents)
4. Copie `.env.example` para `.env` e preencha as credenciais

```bash
cp .env.example .env
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

📖 **Guia completo de configuração**: [SETUP.md](./SETUP.md)

## 📁 Estrutura do Projeto

```
duna/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Contextos React
│   ├── hooks/            # Custom hooks (useAuth, useData, etc)
│   ├── lib/              # Clientes (Supabase, Stripe)
│   ├── pages/            # Páginas da aplicação
│   ├── types/            # Tipos TypeScript
│   ├── data/             # Dados seed (fallback)
│   ├── App.tsx           # Componente raiz
│   └── main.tsx          # Entry point
├── supabase/
│   └── schema.sql        # Schema completo do banco
├── public/               # Assets estáticos
├── .env.example          # Template de variáveis de ambiente
├── SETUP.md              # Guia de configuração completo
└── README.md             # Este arquivo
```

## 🔑 Funcionalidades Detalhadas

### Para Hóspedes

| Funcionalidade | Status | Descrição |
|---|---|---|
| Cadastro/Login | ✅ Real | Via Supabase Auth com email |
| Busca com filtros | ✅ Real | Preço, tipo, quartos, comodidades |
| Página do imóvel | ✅ Real | Galeria, descrição, avaliações |
| Calendário de disponibilidade | ✅ Real | Baseado em reservas confirmadas |
| Reserva | ✅ Real | Com validação de conflito de datas |
| Pagamento | ⚙️ Pronto | Integração Stripe preparada |
| Chat com anfitrião | ✅ Real | Via Supabase Realtime |
| Avaliar estadia | ✅ Real | Apenas após check-out |
| Favoritos | ✅ Real | Persistido no banco |
| Listas de desejos | ✅ Real | Múltiplas listas |
| Programa de fidelidade | ✅ Real | 4 níveis com benefícios |
| Cancelamento | ✅ Real | Política flexível/moderada/rígida |

### Para Anfitriões

| Funcionalidade | Status | Descrição |
|---|---|---|
| Cadastro de imóvel | ✅ Real | Com upload de imagens |
| Upload de fotos | ✅ Real | Via Supabase Storage |
| Gestão de disponibilidade | ✅ Real | Calendário interativo |
| Dashboard financeiro | ✅ Real | Receita, ocupação, reservas |
| Chat com hóspedes | ✅ Real | Via Supabase Realtime |
| Avaliar hóspedes | ✅ Real | Bidirecional |
| Política de cancelamento | ✅ Real | Configurável por imóvel |

### Para Admin

| Funcionalidade | Status | Descrição |
|---|---|---|
| Gestão de usuários | ✅ Real | Ver, bloquear, alterar roles |
| Moderação de imóveis | ✅ Real | Aprovar/reprovar publicações |
| Gestão de comissões | ✅ Real | Configurável no banco |
| Visualização de pagamentos | ✅ Real | Dashboard completo |
| Logs de auditoria | ✅ Real | Todas as ações críticas |
| Configuração do sistema | ✅ Real | Taxas, políticas, limites |

## 💰 Modelo de Negócio

### Comissões

- **Taxa do hóspede**: 6% sobre o valor da reserva (configurável)
- **Taxa do anfitrião**: 2% sobre o valor da reserva (configurável)
- **Comissão Duna**: Registrada em tabela `commissions`

### Afiliados

- **Programa B2B**: 20% recorrente sobre mensalidade de imobiliárias
- **Programa B2C**: 15% da taxa de serviço por reserva indicada
- **Saque**: Fluxo completo (solicitado → processando → pago)

## 🔒 Segurança

- **Row Level Security (RLS)** em todas as tabelas
- **Autenticação JWT** via Supabase Auth
- **Validação no backend** (não confia no frontend)
- **Proteção contra SQL Injection** (via Supabase client)
- **Rate limiting** (configurável no Supabase)
- **Verificação de email** obrigatória
- **Senhas hasheadas** (bcrypt via Supabase)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Lint
npm run lint

# Type check
npm run typecheck
```

## 📊 Banco de Dados

O schema completo está em `supabase/schema.sql` e inclui:

- `profiles` — Perfis de usuário (extends auth.users)
- `properties` — Imóveis
- `property_images` — Imagens dos imóveis
- `amenities` — Comodidades
- `property_amenities` — Relação imóvel-comodidade
- `locations` — Localizações
- `availability` — Datas bloqueadas
- `reservations` — Reservas
- `payments` — Pagamentos
- `commissions` — Comissões
- `reviews` — Avaliações
- `favorites` — Favoritos
- `wishlists` — Listas de desejos
- `conversations` — Conversas
- `messages` — Mensagens
- `notifications` — Notificações
- `affiliates` — Afiliados
- `affiliate_clicks` — Cliques de afiliados
- `affiliate_conversions` — Conversões
- `withdrawals` — Solicitações de saque
- `audit_logs` — Logs de auditoria
- `system_config` — Configurações do sistema

## 🌍 Deploy

### Frontend (Vercel/Netlify)

```bash
npm run build
```

Upload da pasta `dist/` para Vercel ou Netlify.

### Backend (Supabase)

Já está configurado! Supabase é SaaS, não precisa de deploy separado.

### Edge Functions (opcional)

```bash
supabase functions deploy stripe-webhook
```

## 📝 Variáveis de Ambiente

| Variável | Obrigatório | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Chave pública do Supabase |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ❌ | Chave pública do Stripe |
| `VITE_GOOGLE_MAPS_KEY` | ❌ | Chave do Google Maps |
| `VITE_APP_NAME` | ❌ | Nome da aplicação |
| `VITE_APP_URL` | ❌ | URL da aplicação |
| `VITE_DEFAULT_COMMISSION_PERCENTAGE` | ❌ | Comissão padrão (6%) |
| `VITE_HOST_FEE_PERCENTAGE` | ❌ | Taxa do anfitrião (2%) |

Ver `.env.example` para todas as variáveis.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

- 📖 [Guia de Configuração](./SETUP.md)
- 📚 [Documentação Supabase](https://supabase.com/docs)
- 💬 Abra uma issue no GitHub

---

**DUNA** — Encontre seu lugar perfeito ☀️

Construído com ❤️ usando React, TypeScript, Tailwind CSS e Supabase.
