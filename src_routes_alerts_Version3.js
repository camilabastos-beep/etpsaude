const express = require('express');
const router = express.Router();
const { Alert } = require('../models');

// listar alerts pendentes
router.get('/', async (req, res) => {
  const tenantId = req.query.tenant_id;
  const alerts = await Alert.findAll({ where: { tenant_id: tenantId, status: 'pending' }});
  res.json(alerts);
});

// ação manual: marcar como reviewed / actioned / criar avaliação aprofundada
router.post('/:id/action', async (req, res) => {
  const { id } = req.params;
  const { action, userId } = req.body; // action: reviewed|actioned|dismiss
  const alert = await Alert.findByPk(id);
  if (!alert) return res.status(404).json({ error: 'Alert não encontrado' });
  alert.status = action === 'dismiss' ? 'dismissed' : (action === 'action' ? 'actioned' : 'reviewed');
  alert.action_taken_by = userId;
  alert.action_taken_at = new Date();
  await alert.save();
  res.json({ ok: true, alert });
});

module.exports = router;