# 🔍 AUDITORIA TÉCNICA — DUNA

**Data**: 2026
**Status**: Reestruturação crítica necessária

---

## ⚠️ PROBLEMA CENTRAL IDENTIFICADO

O projeto atual **NÃO é um marketplace funcional**. É um frontend React com dados simulados via localStorage.

### Evidências

| Componente | Status Real | Problema |
|---|---|---|
| **Banco de dados** | ❌ MOCK | `localStorage` + arrays hardcoded em `src/data/seed.ts` |
| **Autenticação** | ❌ MOCK | `login(email, role)` no AppContext — sem validação real |
| **Reservas** | ❌ MOCK | Criadas em memória, sem validação de conflito |
| **Pagamentos** | ❌ MOCK | Botão que apenas muda status para "paid" |
| **Comissões** | ❌ MOCK | Calculadas no frontend, sem persistência |
| **Chat** | ❌ MOCK | Mensagens em localStorage, sem realtime |
| **Avaliações** | ❌ MOCK | Qualquer usuário pode avaliar qualquer imóvel |
| **Favoritos** | ❌ MOCK | Persistidos em localStorage, não em conta |
| **Afiliados** | ❌ MOCK | Comissões calculadas sem base real |
| **Dashboard** | ❌ MOCK | Números baseados em dados simulados |
| **Autorização** | ❌ INEXISTENTE | Qualquer URL é acessível por qualquer usuário |
| **RLS/Segurança** | ❌ INEXISTENTE | Sem proteção contra IDOR |

### Consequências

1. **Um hóspede pode cancelar reserva de outro hóspede** alterando o ID na URL
2. **Um anfitrião pode editar imóvel de outro anfitrião**
3. **Datas podem ser sobre-reservadas** (sem validação transacional)
4. **Pagamentos são falsos** — nenhum dinheiro é processado
5. **Comissões são inventadas** — sem base contábil real
6. **Avaliações podem ser falsificadas** por qualquer usuário
7. **Dados desaparecem** ao limpar localStorage ou trocar de dispositivo

---

## 🎯 DECISÃO DE REESTRUTURAÇÃO

### O que será feito

1. **Remover a camada de mock** (AppContext com localStorage)
2. **Implementar autenticação real** via Supabase Auth
3. **Implementar banco de dados real** via Supabase PostgreSQL
4. **Implementar storage real** via Supabase Storage
5. **Implementar Row Level Security (RLS)** para proteção de dados
6. **Criar tela de configuração** quando Supabase não estiver configurado
7. **Documentar honestamente** o que funciona e o que depende de configuração externa

### O que NÃO será feito (por limitação técnica)

1. ❌ **Webhook de pagamento** — requer backend server (Supabase Edge Function)
2. ❌ **Processamento de pagamento real** — requer credenciais Stripe
3. ❌ **Emails transacionais customizados** — requer provedor de email
4. ❌ **Verificação de identidade** — requer serviço especializado
5. ❌ **Detecção de fraude** — requer ML e análise em tempo real

---

## 📊 ARQUITETURA ATUAL vs. PROPOSTA

### Atual (MOCK)

```
Frontend (React)
    ↓
AppContext (localStorage)
    ↓
seed.ts (dados hardcoded)
```

### Proposta (REAL)

```
Frontend (React)
    ↓
Hooks (useAuth, useData, useImageUpload)
    ↓
Supabase Client
    ↓
Supabase Backend
    ├── Auth (autenticação real)
    ├── PostgreSQL (banco real)
    ├── Storage (imagens reais)
    └── Realtime (chat real)
```

---

## 🔐 SEGURANÇA

### Problemas críticos

1. **Sem RLS**: Qualquer usuário autenticado pode acessar dados de outros
2. **Sem validação de role**: Frontend esconde menus, mas URLs são acessíveis
3. **Sem IDOR protection**: IDs podem ser alterados na URL
4. **Sem rate limiting**: Sem proteção contra brute force
5. **Sem CSRF protection**: Sem tokens CSRF

### Solução

- **RLS no Supabase**: Políticas por tabela
- **Validação no backend**: Hooks verificam permissões
- **Proteção de rotas**: Redirecionamento baseado em role
- **Rate limiting**: Configurável no Supabase

---

## 💰 INTEGRIDADE FINANCEIRA

### Problemas críticos

1. **Preço calculado no frontend**: Pode ser manipulado
2. **Comissão hardcoded**: Não é configurável
3. **Sem split de pagamento**: Não há divisão real
4. **Sem payout**: Não há repasse real
5. **Sem conciliação**: Não há reconciliação de pagamentos

### Solução

- **Cálculo no backend**: Supabase Edge Function ou trigger
- **Comissão configurável**: Tabela `system_config`
- **Split preparado**: Estrutura para Stripe Connect
- **Payout preparado**: Tabela `payouts` com status
- **Conciliação**: Webhook handler para reconciliar

---

## 📋 PRIORIDADES

### P0 — BLOQUEADORES (implementar agora)

- [x] Remover mock do AppContext
- [x] Implementar autenticação real (Supabase Auth)
- [x] Implementar banco de dados real (Supabase PostgreSQL)
- [x] Implementar RLS (Row Level Security)
- [x] Criar tela de configuração
- [x] Documentar honestamente o que falta

### P1 — IMPORTANTES (requer configuração externa)

- [ ] Pagamento real (Stripe) — requer `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Webhook handler — requer Supabase Edge Function
- [ ] Emails transacionais — requer provedor de email
- [ ] Mapa real — requer `VITE_GOOGLE_MAPS_KEY`

### P2 — EVOLUÇÃO (futuro)

- [ ] Verificação de identidade
- [ ] Detecção de fraude
- [ ] App mobile
- [ ] Multi-idioma

---

## 🎯 CRITÉRIO DE SUCESSO

O projeto será considerado **honesto e funcional** quando:

1. ✅ Autenticação for real (Supabase Auth)
2. ✅ Banco de dados for real (Supabase PostgreSQL)
3. ✅ Storage for real (Supabase Storage)
4. ✅ RLS estiver habilitado
5. ✅ Tela de configuração aparecer quando Supabase não estiver configurado
6. ✅ Documentação for clara sobre o que funciona e o que não
7. ✅ Nenhum dado for simulado como se fosse real

---

## 📝 CONCLUSÃO

O projeto atual é um **protótipo visual**, não um marketplace funcional. A reestruturação proposta transforma o DUNA em uma plataforma **real e honesta**, onde:

- **O que funciona** funciona de verdade (autenticação, banco, storage)
- **O que não funciona** é claramente identificado e documentado
- **O que depende de configuração externa** é preparado e documentado

**Nenhum dado será simulado como se fosse real.**

---

**DUNA** — De protótipo visual para marketplace real ☀️
