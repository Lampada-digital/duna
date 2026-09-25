# 🚀 Guia de Configuração do DUNA

Este guia vai te ajudar a configurar o DUNA para produção usando Supabase como backend completo.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- (Opcional) Conta no [Stripe](https://stripe.com) para pagamentos
- (Opcional) Conta no [Resend](https://resend.com) para emails customizados

---

## 🔧 Passo 1: Configurar Supabase

### 1.1 Criar projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: `duna` (ou o nome que preferir)
   - **Database Password**: (guarde esta senha!)
   - **Region**: South America (São Paulo) para melhor performance no Brasil
4. Aguarde o projeto ser criado (~2 minutos)

### 1.2 Executar schema SQL

1. No dashboard do Supabase, vá em **SQL Editor** (ícone no menu lateral)
2. Clique em **"New Query"**
3. Copie TODO o conteúdo de `supabase/schema.sql`
4. Cole no editor e clique em **"Run"**
5. Aguarde a execução (~10 segundos)
6. Verifique se todas as tabelas foram criadas em **Table Editor**

### 1.3 Configurar Storage

1. Vá em **Storage** no menu lateral
2. Crie 3 buckets:

#### Bucket: `property-images`
- Name: `property-images`
- Public bucket: ✅ **SIM** (imagens precisam ser acessíveis)
- File size limit: `5MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket: `avatars`
- Name: `avatars`
- Public bucket: ✅ **SIM**
- File size limit: `2MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp`

#### Bucket: `documents`
- Name: `documents`
- Public bucket: ❌ **NÃO** (documentos privados)
- File size limit: `10MB`

### 1.4 Configurar Auth

1. Vá em **Authentication > Providers**
2. Configure **Email**:
   - Enable Email provider: ✅
   - Confirm email: ✅
3. (Opcional) Configure **Phone** para login por SMS
4. Vá em **Authentication > URL Configuration**
   - Site URL: `http://localhost:5173` (dev) ou sua URL de produção
   - Redirect URLs: `http://localhost:5173/**`

### 1.5 Pegar credenciais

1. Vá em **Settings > API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

## 🔐 Passo 2: Configurar Variáveis de Ambiente

### 2.1 Criar arquivo .env

```bash
cp .env.example .env
```

### 2.2 Preencher .env

```env
# OBRIGATÓRIO
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# OPÇÕES DO SISTEMA
VITE_APP_NAME=Duna
VITE_APP_URL=http://localhost:5173
VITE_DEFAULT_COMMISSION_PERCENTAGE=6
VITE_HOST_FEE_PERCENTAGE=2
VITE_CURRENCY=BRL
VITE_CURRENCY_SYMBOL=R$
```

---

## 💳 Passo 3: Configurar Pagamentos (Stripe)

### 3.1 Criar conta Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Ative o **modo teste** em [dashboard.stripe.com/test](https://dashboard.stripe.com/test)

### 3.2 Pegar chaves

1. Vá em **Developers > API keys**
2. Copie **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`

### 3.3 Configurar produtos (no Stripe Dashboard)

Crie estes produtos para assinatura de anfitriões:
- **Plano Básico**: R$ 99/mês
- **Plano Profissional**: R$ 199/mês
- **Plano Premium**: R$ 399/mês

### 3.4 Configurar Webhooks (para produção)

Para webhooks, você precisará de um backend. Recomendo usar **Supabase Edge Functions**:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Criar função
supabase functions new stripe-webhook
```

Adicione ao `.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

⚠️ **IMPORTANTE**: `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` NUNCA devem estar no frontend! Use Supabase Edge Functions ou um backend separado.

---

## 📧 Passo 4: Configurar Emails (Opcional)

O Supabase já envia emails automáticos (confirmação, reset de senha). Para emails transacionais customizados:

### Opção A: Usar templates do Supabase

1. Vá em **Authentication > Email Templates**
2. Customize os templates com a marca Duna

### Opção B: Usar Resend (recomendado)

1. Crie conta em [resend.com](https://resend.com)
2. Verifique seu domínio
3. Pegue a API key
4. Crie uma Supabase Edge Function para enviar emails

---

## 🗺️ Passo 5: Configurar Mapas (Opcional)

Para mapa interativo real:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto
3. Ative **Maps JavaScript API**
4. Crie uma API Key em **Credentials**
5. Restringa a key para seu domínio

Adicione ao `.env`:
```env
VITE_GOOGLE_MAPS_KEY=AIza...
```

---

## 🏃 Passo 6: Rodar o Projeto

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

### Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

---

## 📝 Passo 7: Criar Primeiro Usuário Admin

Após configurar tudo:

1. Acesse o site e crie uma conta normalmente
2. No Supabase, vá em **Table Editor > profiles**
3. Encontre seu usuário e mude `role` para `admin`
4. Agora você tem acesso ao painel administrativo

---

## ✅ Checklist de Produção

Antes de ir para produção, verifique:

- [ ] Supabase configurado e schema executado
- [ ] Variáveis de ambiente preenchidas
- [ ] Buckets de storage criados com políticas corretas
- [ ] Auth configurado (email confirmado)
- [ ] Stripe configurado (modo teste funcionando)
- [ ] Webhooks configurados (se usando pagamentos)
- [ ] Templates de email customizados
- [ ] Domínio verificado no Supabase
- [ ] RLS (Row Level Security) habilitado em todas as tabelas
- [ ] Testado fluxo completo: cadastro → busca → reserva → pagamento

---

## 🐛 Troubleshooting

### "Supabase não configurado"

- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão preenchidos
- Reinicie o servidor de desenvolvimento após mudar o `.env`

### "Erro de permissão ao inserir dados"

- Verifique se o RLS está habilitado
- Verifique se as policies estão corretas
- Teste com um usuário autenticado

### "Imagens não aparecem"

- Verifique se o bucket `property-images` é público
- Verifique as permissões do bucket em Supabase > Storage

### "Emails não são enviados"

- Verifique a configuração em Supabase > Authentication > Email
- Verifique a pasta de spam do usuário
- Confirme o domínio em Supabase se necessário

---

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Stripe](https://stripe.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no console do navegador (F12)
2. Verifique os logs no Supabase Dashboard > Logs
3. Consulte a documentação oficial
4. Abra uma issue no repositório

---

**DUNA** — Marketplace de aluguel por temporada ☀️
