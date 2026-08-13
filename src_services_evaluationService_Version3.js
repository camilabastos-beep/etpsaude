const { Evaluation, Alert, sequelize } = require('../models');
const { detectAlertsForEvaluation } = require('./alertDetector');

async function createEvaluation(payload) {
  // payload: { tenant_id, driver_id, type, data, created_by }
  return await sequelize.transaction(async (tx) => {
    // calcular scores (implemente computeScores conforme seu questionário)
    const scores = computeScores(payload.data);
    const evalRow = await Evaluation.create({
      tenant_id: payload.tenant_id,
      driver_id: payload.driver_id,
      type: payload.type,
      data: payload.data,
      score_work: scores.work,
      score_sleep: scores.sleep,
      score_mental: scores.mental,
      score_lifestyle: scores.lifestyle,
      score_total: scores.total,
      risk_classification: scores.classification,
      alert_flag: false,
      alert_count: 0,
      created_by: payload.created_by
    }, { transaction: tx });

    // detectar alertas (retorna lista)
    const alerts = detectAlertsForEvaluation(evalRow, scores);
    if (alerts.length > 0) {
      evalRow.alert_flag = true;
      evalRow.alert_count = alerts.length;
      await evalRow.save({ transaction: tx });
      for (const a of alerts) {
        await Alert.create({
          tenant_id: evalRow.tenant_id,
          evaluation_id: evalRow.id,
          driver_id: evalRow.driver_id,
          alert_type: a.type,
          severity: a.severity,
          evidence: a.evidence,
          created_by: null,
          auto_triggered: true,
          status: 'pending'
        }, { transaction: tx });
      }
    }

    return { evaluation: evalRow.toJSON(), alertsDetected: alerts.length };
  });
}

function computeScores(data) {
  const work = data.condicoes_trabalho_score || 0;
  const sleep = data.sono_score || 0;
  const mental = data.saude_mental_score || 0;
  const lifestyle = data.estilo_vida_score || 0;
  const total = work + sleep + mental + lifestyle;
  let classification = 'Baixo risco';
  if (total > 70) classification = 'Risco alto';
  else if (total > 40) classification = 'Risco moderado';
  return { work, sleep, mental, lifestyle, total, classification };
}

module.exports = { createEvaluation };