/*
  Seed inicial: cria roles e o usuário ADMIN com a senha informada via .env
  Execute: node src/scripts/seed_admin.js
*/
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

async function run() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres', logging: false });
  try {
    await sequelize.query("INSERT INTO roles (id, name) VALUES (uuid_generate_v4(), 'ADMIN') ON CONFLICT (name) DO NOTHING;");
    await sequelize.query("INSERT INTO roles (id, name) VALUES (uuid_generate_v4(), 'PSICOLOGO') ON CONFLICT (name) DO NOTHING;");
    await sequelize.query("INSERT INTO roles (id, name) VALUES (uuid_generate_v4(), 'GESTOR') ON CONFLICT (name) DO NOTHING;");
    await sequelize.query("INSERT INTO roles (id, name) VALUES (uuid_generate_v4(), 'CONSULTA') ON CONFLICT (name) DO NOTHING;");

    const password = process.env.ADMIN_PASSWORD || 'Sentinela123!';
    const hash = await bcrypt.hash(password, 10);
    const email = process.env.ADMIN_EMAIL || 'admin@local.test';
    const name = 'Admin Sentinela';

    await sequelize.query(`
      INSERT INTO users (id, name, email, password_hash, role_id)
      SELECT uuid_generate_v4(), '${name}', '${email}', '${hash}', r.id
      FROM roles r WHERE r.name = 'ADMIN' AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = '${email}');
    `);

    console.log('Seed completo. Usuário admin:', email);
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

run();