const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

const Role = sequelize.define('Role', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') },
  name: { type: DataTypes.STRING, unique: true }
}, { tableName: 'roles', timestamps: false });

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password_hash: DataTypes.STRING
}, { tableName: 'users', timestamps: false });

const Tenant = sequelize.define('Tenant', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') },
  name: DataTypes.STRING
}, { tableName: 'tenants', timestamps: false });

const Driver = sequelize.define('Driver', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') },
  name: DataTypes.STRING,
  cpf: DataTypes.STRING,
  company: DataTypes.STRING,
  branch: DataTypes.STRING,
  plate: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  notes: DataTypes.TEXT
}, { tableName: 'drivers', timestamps: false });

const Evaluation = sequelize.define('Evaluation', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') },
  type: DataTypes.STRING,
  data: DataTypes.JSONB,
  score_work: DataTypes.INTEGER,
  score_sleep: DataTypes.INTEGER,
  score_mental: DataTypes.INTEGER,
  score_lifestyle: DataTypes.INTEGER,
  score_total: DataTypes.INTEGER,
  risk_classification: DataTypes.STRING,
  alert_flag: DataTypes.BOOLEAN,
  alert_count: DataTypes.INTEGER
}, { tableName: 'evaluations', timestamps: false });

const Alert = sequelize.define('Alert', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') },
  alert_type: DataTypes.STRING,
  severity: DataTypes.STRING,
  evidence: DataTypes.JSONB,
  auto_triggered: DataTypes.BOOLEAN,
  status: DataTypes.STRING
}, { tableName: 'alerts', timestamps: false });

Tenant.hasMany(User, { foreignKey: 'tenant_id' });
Tenant.hasMany(Driver, { foreignKey: 'tenant_id' });
Tenant.hasMany(Evaluation, { foreignKey: 'tenant_id' });
Driver.hasMany(Evaluation, { foreignKey: 'driver_id' });
Evaluation.belongsTo(Driver, { foreignKey: 'driver_id' });

module.exports = {
  sequelize,
  Sequelize,
  Role,
  User,
  Tenant,
  Driver,
  Evaluation,
  Alert
};