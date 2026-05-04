CREATE TABLE profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name          TEXT,
  avatar_url         TEXT,
  preferred_currency CHAR(3)  NOT NULL DEFAULT 'PEN',
  auto_save_pct      NUMERIC(5,2) DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE accounts (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT    NOT NULL,
  type       TEXT    NOT NULL CHECK (type IN ('checking','savings','cash','credit_card','investment')),
  currency   CHAR(3) NOT NULL DEFAULT 'PEN',
  balance    NUMERIC(15,2) NOT NULL DEFAULT 0,
  color      CHAR(7),
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE categories (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  type      TEXT NOT NULL CHECK (type IN ('income','expense')),
  icon      TEXT,
  color     CHAR(7),
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE transactions (
  id                     UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id             UUID    NOT NULL REFERENCES accounts(id),
  destination_account_id UUID    REFERENCES accounts(id),
  -- solo se llena en transferencias
  category_id            UUID    REFERENCES categories(id) ON DELETE SET NULL,
  type                   TEXT    NOT NULL CHECK (type IN ('income','expense','transfer')),
  amount                 NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  description            TEXT,
  date                   DATE    NOT NULL,
  receipt_url            TEXT,
  -- URL del comprobante guardado en Supabase Storage
  is_recurring           BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE budgets (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id  UUID    NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  month        DATE    NOT NULL,
  -- siempre el primer día del mes: 2025-06-01
  amount       NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  alert_at_pct INTEGER NOT NULL DEFAULT 80,
  -- alerta cuando se usa el 80% del presupuesto
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id, month)
  -- no puede haber dos presupuestos del mismo mes y categoría
);


CREATE TABLE debts (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  counterpart  TEXT    NOT NULL,
  -- nombre de la persona o entidad
  direction    TEXT    NOT NULL CHECK (direction IN ('i_owe','they_owe_me')),
  -- 'i_owe' = yo debo, 'they_owe_me' = me deben
  amount       NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  currency     CHAR(3) NOT NULL DEFAULT 'PEN',
  description  TEXT,
  due_date     DATE,
  is_paid      BOOLEAN NOT NULL DEFAULT false,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE savings_goals (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id     UUID    REFERENCES accounts(id) ON DELETE SET NULL,
  -- cuenta donde se acumula este ahorro (opcional)
  name           TEXT    NOT NULL,
  target_amount  NUMERIC(15,2) NOT NULL CHECK (target_amount > 0),
  saved_amount   NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency       CHAR(3) NOT NULL DEFAULT 'PEN',
  target_date    DATE,
  status         TEXT    NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','completed','cancelled')),
  icon           TEXT,
  color          CHAR(7),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE investments (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name           TEXT    NOT NULL,
  ticker         TEXT,
  -- símbolo bursátil, ej: AAPL, BTC, VOO
  asset_type     TEXT    NOT NULL
                         CHECK (asset_type IN ('stock','etf','crypto','bond','fund','real_estate','other')),
  currency       CHAR(3) NOT NULL DEFAULT 'USD',
  total_invested NUMERIC(15,2) NOT NULL DEFAULT 0,
  -- cuánto he puesto en total
  current_value  NUMERIC(15,2) NOT NULL DEFAULT 0,
  -- cuánto vale hoy (se actualiza manualmente o con API)
  notes          TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE recurring_transactions (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id  UUID    NOT NULL REFERENCES accounts(id),
  category_id UUID    REFERENCES categories(id) ON DELETE SET NULL,
  type        TEXT    NOT NULL CHECK (type IN ('income','expense')),
  amount      NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  description TEXT    NOT NULL,
  interval    TEXT    NOT NULL
              CHECK (interval IN ('daily','weekly','biweekly','monthly','yearly')),
  next_date   DATE    NOT NULL,
  -- próxima fecha en que se debe generar la transacción
  end_date    DATE,
  -- si es NULL, no tiene fin (ej: sueldo indefinido)
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE debt_payments (                                                                                                                                        
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),                                                                                                            
    debt_id    UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,                                                                                                  
    amount     NUMERIC(15,2) NOT NULL CHECK (amount > 0),                                                                                                             
    note       TEXT,                                                                                                                                                  
    paid_at    DATE NOT NULL DEFAULT CURRENT_DATE,                                                                                                                    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now() 
  );  


  ALTER TABLE recurring_transactions
    ADD COLUMN last_executed_at date NULL;   



     UPDATE accounts a                                                                                                                                                                                                                        
  SET balance = COALESCE((                                                                                                                                                                                                                 
    SELECT                                                                                                                                                                                                                                 
      SUM(CASE                                              
        WHEN t.type = 'income'   THEN  t.amount                                                                                                                                                                                            
        WHEN t.type = 'expense'  THEN -t.amount                                                                                                                                                                                            
        WHEN t.type = 'transfer' AND t.account_id = a.id             THEN -t.amount
        WHEN t.type = 'transfer' AND t.destination_account_id = a.id THEN  t.amount                                                                                                                                                        
        ELSE 0                                                                                                                                                                                                                             
      END)                                                                                                                                                                                                                                 
    FROM transactions t                                                                                                                                                                                                                    
    WHERE t.account_id = a.id                               
       OR t.destination_account_id = a.id
  ), 0);

  ---


  -- ══════════════════════════════════════════════
  -- FUNCIÓN PRINCIPAL                                                                                                                                                                                                                     
  -- ══════════════════════════════════════════════         
  CREATE OR REPLACE FUNCTION fn_sync_account_balance()                                                                                                                                                                                     
  RETURNS TRIGGER AS $$                                                                                                                                                                                                                    
  BEGIN
                                                                                                                                                                                                                                           
    -- ── INSERT ──────────────────────────────────                                                                                                                                                                                        
    IF TG_OP = 'INSERT' THEN
      IF NEW.type = 'income' THEN                                                                                                                                                                                                          
        UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
                                                                                                                                                                                                                                           
      ELSIF NEW.type = 'expense' THEN
        UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;                                                                                                                                                      
                                                            
      ELSIF NEW.type = 'transfer' THEN                                                                                                                                                                                                     
        UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        IF NEW.destination_account_id IS NOT NULL THEN                                                                                                                                                                                     
          UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.destination_account_id;
        END IF;                                                                                                                                                                                                                            
      END IF;
                                                                                                                                                                                                                                           
    -- ── DELETE ──────────────────────────────────                                                                                                                                                                                        
    ELSIF TG_OP = 'DELETE' THEN
      IF OLD.type = 'income' THEN                                                                                                                                                                                                          
        UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;

      ELSIF OLD.type = 'expense' THEN                                                                                                                                                                                                      
        UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
                                                                                                                                                                                                                                           
      ELSIF OLD.type = 'transfer' THEN                      
        UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        IF OLD.destination_account_id IS NOT NULL THEN
          UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.destination_account_id;                                                                                                                                        
        END IF;
      END IF;                                                                                                                                                                                                                              
                                                            
    -- ── UPDATE ──────────────────────────────────
    -- Revierte el efecto del row anterior y aplica el nuevo
    ELSIF TG_OP = 'UPDATE' THEN                                                                                                                                                                                                            
      -- Revertir OLD
      IF OLD.type = 'income' THEN                                                                                                                                                                                                          
        UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
      ELSIF OLD.type = 'expense' THEN                                                                                                                                                                                                      
        UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
      ELSIF OLD.type = 'transfer' THEN                                                                                                                                                                                                     
        UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;                                                                                                                                                      
        IF OLD.destination_account_id IS NOT NULL THEN
          UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.destination_account_id;                                                                                                                                        
        END IF;                                                                                                                                                                                                                            
      END IF;
                                                                                                                                                                                                                                           
      -- Aplicar NEW                                        
      IF NEW.type = 'income' THEN
        UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
      ELSIF NEW.type = 'expense' THEN
        UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;                                                                                                                                                      
      ELSIF NEW.type = 'transfer' THEN
        UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;                                                                                                                                                      
        IF NEW.destination_account_id IS NOT NULL THEN      
          UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.destination_account_id;                                                                                                                                        
        END IF;
      END IF;                                                                                                                                                                                                                              
    END IF;                                                 

    RETURN COALESCE(NEW, OLD);                                                                                                                                                                                                             
  END;
  $$ LANGUAGE plpgsql; 


  -- ══════════════════════════════════════════════
  -- TRIGGER
  -- ══════════════════════════════════════════════
  DROP TRIGGER IF EXISTS trg_sync_account_balance ON transactions;
                                                                                                                                                                                                                                           
  CREATE TRIGGER trg_sync_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON transactions                                                                                                                                                                                         
  FOR EACH ROW EXECUTE FUNCTION fn_sync_account_balance();


select * from profiles


update auth.users
set encrypted_password = crypt('Luna1994', gen_salt('bf'))
where email = 'mirian.luz.adriano.lazaro.01@gmail.com';


INSERT INTO categories (user_id, name, type, icon, color)
VALUES
  (NULL, 'Salario',         'income',  '💼', '#16A34A'),
  (NULL, 'Freelance',       'income',  '💻', '#0284C7'),
  (NULL, 'Alimentación',    'expense', '🛒', '#DC2626'),
  (NULL, 'Transporte',      'expense', '🚗', '#D97706'),
  (NULL, 'Vivienda',        'expense', '🏠', '#7C3AED'),
  (NULL, 'Salud',           'expense', '❤️', '#EC4899'),
  (NULL, 'Entretenimiento', 'expense', '🎬', '#9333EA');



  select * from transactions