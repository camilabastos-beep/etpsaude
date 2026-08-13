-- Migração inicial: avaliações, alerts, alert_config, users, drivers, roles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de empresas (tenant) opcional
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Perfis/roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE -- ADMIN, PSICOLOGO, GESTOR, CONSULTA
);

-- Usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Motoristas
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  cpf VARCHAR(20),
  company TEXT,
  branch TEXT,
  plate TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  registered_at TIMESTAMP DEFAULT now()
);

-- Avaliações (generic)
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  driver_id UUID REFERENCES drivers(id),
  type VARCHAR(50) NOT NULL, -- biopsicossocial | cronotipo | aprofundada
  data JSONB NOT NULL, -- respostas
  score_work INTEGER,
  score_sleep INTEGER,
  score_mental INTEGER,
  score_lifestyle INTEGER,
  score_total INTEGER,
  risk_classification VARCHAR(20),
  alert_flag BOOLEAN DEFAULT FALSE,
  alert_count INTEGER DEFAULT 0,
  last_alert_id UUID,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  evaluation_id UUID REFERENCES evaluations(id),
  driver_id UUID REFERENCES drivers(id),
  alert_type VARCHAR(100),
  severity VARCHAR(20),
  evidence JSONB,
  created_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  auto_triggered BOOLEAN DEFAULT FALSE,
  auto_action_taken BOOLEAN DEFAULT FALSE,
  action_taken_by UUID,
  action_taken_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, actioned, dismissed
  notes TEXT
);

-- Configuração de regras de alerta (admin)
CREATE TABLE IF NOT EXISTS alert_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  rule_name TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  condition JSONB,
  action VARCHAR(50) DEFAULT 'none', -- none | notify | auto_create_eval
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_evaluations_driver ON evaluations(driver_id);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant_status ON alerts(tenant_id, status);