# DUNA - Marketplace de Aluguel por Temporada

Marketplace de aluguel por temporada inspirado no Airbnb, com identidade visual única e funcionalidades modernas.

## ✅ Funcionalidades Implementadas (100% Funcionais)

### Lado do Hóspede
- ✅ **Busca avançada** com filtros (preço, tipo, quartos, comodidades, avaliação)
- ✅ **Página do imóvel** com galeria 1+4, calendário de disponibilidade, avaliações
- ✅ **Checkout completo** com cálculo automático de taxas (6% Duna + limpeza)
- ✅ **Minhas reservas** com histórico, cancelamento, avaliações
- ✅ **Chat interno** entre hóspede e anfitrião (funcional com localStorage)
- ✅ **Avaliações bidirecionais** (hóspede avalia imóvel)
- ✅ **Sistema de favoritos** com listas personalizadas
- ✅ **Programa de fidelidade** com níveis (Bronze, Prata, Ouro, Platina)
- ✅ **Cancelamento grátis 24h** (lógica implementada)

### Lado do Anfitrião/Imobiliária
- ✅ **Painel da imobiliária** com dashboard financeiro
- ✅ **Gestão de imóveis** (ativar/desativar, editar)
- ✅ **Calendário de disponibilidade** (bloquear datas)
- ✅ **Lista de reservas recebidas** com status
- ✅ **Dashboard** com receita, ocupação, próximas chegadas

### Sistema de Afiliados
- ✅ **Programa B2B** (indicar imobiliárias - 20% recorrente por 12 meses)
- ✅ **Programa B2C** (indicar hóspedes - 15% da taxa Duna)
- ✅ **Links e códigos únicos** com rastreamento por cookie
- ✅ **Painel do afiliado** com cliques, conversões, comissões
- ✅ **Solicitação de saque** com fluxo completo (solicitado → processando → pago)
- ✅ **Painel admin** para aprovar/rejeitar saques

### Modelo de Cobrança
- ✅ **Taxa de serviço do hóspede**: 6% (exibida como "Taxa Duna")
- ✅ **Taxa da imobiliária**: 2% (calculada no booking)
- ✅ **Split registrado** no banco de dados (localStorage)

### Design & UX
- ✅ **Design system** com paleta terrosa (areia, terracota) + azul profundo
- ✅ **Tipografia tripla**: Playfair Display + Plus Jakarta Sans + Inter
- ✅ **Inspirado no Airbnb**: search pill, cards com carousel, categorias
- ✅ **100% responsivo** (mobile-first)
- ✅ **Dark mode** com toggle
- ✅ **Animações suaves** com Framer Motion
- ✅ **Skeleton loaders** em todas as listagens
- ✅ **Empty states** ilustrados

## ⚠️ Funcionalidades que Precisam de Backend Real

### Confiança e Segurança (Airbnb levou 18 anos para construir)
- ❌ **Verificação de identidade** (documento + selfie + checagem de antecedentes)
- ❌ **Motor de detecção de fraude** (cartões roubados, contas falsas)
- ❌ **AirCover** (seguro/garantia para hóspedes e anfitriões)
- ❌ **Central de resolução de disputas** (mediação multilíngue)

### Dinheiro e Conformidade
- ❌ **Sistema de custódia (escrow)** (pagamento retido até check-in)
- ❌ **Cálculo automático de impostos** por cidade/país (taxa de turismo)
- ❌ **Integração com gateway de pagamento** (Stripe/Mercado Pago real)
- ❌ **Emissão de nota fiscal** automática
- ❌ **Conversão de moeda** em tempo real

### Operação e Qualidade
- ❌ **Moderação de anúncios** (detectar spam/fotos falsas)
- ❌ **Moderação de avaliações** (detectar avaliações compradas)
- ❌ **Algoritmo de ranking de busca** com testes A/B
- ❌ **Sistema de tickets** para suporte ao cliente

### Comunicação
- ❌ **Envio de e-mails transacionais** (confirmação, lembretes)
- ❌ **Notificações push** (iOS/Android)
- ❌ **SMS** para confirmações importantes

## 🏗️ Arquitetura Atual

### Frontend (este projeto)
- **React 18** + **TypeScript**
- **Vite** para build
- **Tailwind CSS 4** para estilos
- **Framer Motion** para animações
- **React Router** com HashRouter
- **LocalStorage** para persistência (simula banco de dados)
- **Recharts** para gráficos

### Backend Necessário (não incluído)
Para tornar o DUNA um produto real, você precisaria de:

1. **API REST ou GraphQL** (Node.js/Express, NestJS, ou similar)
2. **Banco de dados** (PostgreSQL recomendado)
3. **Autenticação** (JWT, OAuth, ou serviço como Auth0/Clerk)
4. **Gateway de pagamento** (Stripe, Mercado Pago)
5. **Serviço de e-mail** (SendGrid, AWS SES)
6. **Storage de imagens** (AWS S3, Cloudinary)
7. **Serviço de verificação de identidade** (Jumio, Onfido)
8. **Sistema de busca** (Elasticsearch, Algolia)

## 🚀 Como Usar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📊 Dados de Demonstração

O sistema vem com dados seed para demonstração:
- 8 imóveis em diferentes cidades brasileiras
- 3 imobiliárias cadastradas
- 7 avaliações de exemplo
- Sistema de afiliados funcional

## 🎯 Próximos Passos Recomendados

1. **Backend MVP**: Construir API com Node.js + PostgreSQL + Prisma
2. **Autenticação real**: Integrar com Auth0 ou Clerk
3. **Pagamentos**: Integrar Stripe para processar reservas reais
4. **Upload de imagens**: Usar Cloudinary ou AWS S3
5. **E-mails**: Configurar SendGrid para confirmações
6. **Deploy**: Vercel (frontend) + Railway/Render (backend)

## 💡 Nota Importante

Este projeto demonstra a **interface e lógica de negócio** de um marketplace de aluguel por temporada. Para operar em produção, você precisará implementar toda a infraestrutura de backend, conformidade fiscal, segurança e integrações com serviços de terceiros.

O Airbnb levou **18 anos** e centenas de engenheiros para construir o sistema completo de confiança e segurança que opera hoje. Não tente replicar tudo de uma vez — comece com um MVP focado no seu nicho (ex: imobiliárias brasileiras) e expanda gradualmente.

## 📄 Licença

Este é um projeto de demonstração. Use como referência para construir seu próprio marketplace.

---

**DUNA** — Encontre seu lugar perfeito ☀️
