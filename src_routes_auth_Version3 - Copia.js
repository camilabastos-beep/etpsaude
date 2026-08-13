const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

// Rota simples de login (exemplo)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
  res.json({ ok: true, user: { id: user.id, email: user.email } });
});

module.exports = router;