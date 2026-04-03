import {
  detectAndPersistAnomalies,
  listAnomalies,
} from '../services/anomalyDetector.js';

export async function getAnomalies(req, res) {
  try {
    await detectAndPersistAnomalies().catch((err) =>
      console.error('[anomalies] detection:', err)
    );
    res.json(await listAnomalies({ unresolvedOnly: false }));
  } catch (e) {
    console.error('[anomalies]', e);
    res.status(500).json({ error: e.message });
  }
}
