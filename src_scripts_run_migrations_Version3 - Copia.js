/**
 * Aplica as migrations SQL presentes em migrations/001_create_core_tables.sql
 * Execute: node src/scripts/run_migrations.js
 */
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '../../migrations/001_create_core_tables.sql'), 'utf8');
  const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres', logging: false });
  try {
    await sequelize.query(sql);
    console.log('Migrations applied');
    process.exit(0);
  } catch (err) {
    console.error('Migration error', err);
    process.exit(1);
  }
}

run();