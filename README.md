# Split Bills 💰

App PWA de controle financeiro para casais — divide contas mensais de forma simples e elegante.

## ✨ Funcionalidades

- PIN pessoal por utilizador (Everson e Claudia)
- Contas recorrentes mensais com data de vencimento
- Data final opcional — a conta para automaticamente
- Registo de quem pagou cada conta
- Divisão 50/50 automática
- Saldo geral mostrando quem deve a quem
- Navegação por mês
- PWA instalável no iPhone e Android

## 🛠 Stack

- React + Vite
- Supabase (PostgreSQL)
- Vercel (deploy)
- PWA (manifest + service worker)

## 🚀 Setup local

### 1. Clonar o repositório
```bash
git clone https://github.com/EversonRubira/split-bills.git
cd split-bills
npm install
```

### 2. Variáveis de ambiente

Cria um ficheiro `.env` na raiz:
```
VITE_SUPABASE_URL=https://bxvmumytfjrhqkgxhzia.supabase.co
VITE_SUPABASE_ANON_KEY=sua_publishable_key_aqui
```

### 3. Rodar localmente
```bash
npm run dev
```

### 4. Deploy

Conecta o repositório no Vercel e adiciona as variáveis de ambiente. O deploy é automático a cada push.

## 🗄 Schema do banco
```sql
-- Contas recorrentes
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  day_of_month INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pagamentos
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
  bill_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_by TEXT NOT NULL CHECK (paid_by IN ('Everson', 'Claudia')),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bill_id, month, year)
);
```

## 🔐 Segurança

- PINs guardados no localStorage de cada dispositivo
- Repositório privado no GitHub
- Variáveis de ambiente no Vercel (nunca no código)

## 📱 Instalar no iPhone

1. Abre o link no Safari
2. Toca no botão de partilha
3. "Adicionar ao ecrã inicial"
