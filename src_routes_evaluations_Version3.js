const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluationsForDriver } = require('../services/evaluationService');

// criar avaliação
router.post('/', async (req, res) => {
  try {
    const result = await createEvaluation(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// listar por motorista
router.get('/driver/:driverId', async (req, res) => {
  try {
    const rows = await getEvaluationsForDriver(req.params.driverId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro' });
  }
});

module.exports = router;