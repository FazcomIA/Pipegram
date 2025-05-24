const db = require('../db/db');
const { IgApiClient } = require('instagram-private-api');

async function loadSessionFromDB(username) {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);

  const { rows } = await db.query('SELECT session_data, proxy FROM sessions WHERE username = $1', [username]);
  if (!rows.length) throw new Error('Sessão não encontrada');

  const { session_data, proxy } = rows[0];

  if (proxy) {
    const { HttpsProxyAgent } = require('hpagent');
    ig.request.defaults.agent = new HttpsProxyAgent({ proxy });
  }

  await ig.state.deserialize(session_data);
  return ig;
}

module.exports = loadSessionFromDB;