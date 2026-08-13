function detectAlertsForEvaluation(evaluation, scores) {
  const alerts = [];
  const data = evaluation.data || {};
  if (data.cochilo_durante_conducao === true) {
    alerts.push({ type: 'cochilo_durante_conducao', severity: 'high', evidence: { field: 'cochilo_durante_conducao' }});
  }
  if (data.relato_quase_acidente === true) {
    alerts.push({ type: 'quase_acidente_por_cansaco', severity: 'critical', evidence: { field: 'relato_quase_acidente' }});
  }
  return alerts;
}

module.exports = { detectAlertsForEvaluation };