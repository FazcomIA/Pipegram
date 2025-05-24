const { IgApiClient } = require("instagram-private-api");
const { HttpsProxyAgent } = require("hpagent");
const sessionManager = require("../utils/sessionManager");

async function createClient(username, proxy = null) {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  if (proxy) {
    ig.request.defaults.agent = new HttpsProxyAgent({ proxy });
  }
  return ig;
}

async function loginWithPassword(username, password, proxy) {
  const ig = await createClient(username, proxy);
  await ig.account.login(username, password);
  const session = await ig.state.serialize();
  sessionManager.saveSession(username, session);
  return { ig, session };
}

async function resumeSession(username) {
  const saved = sessionManager.loadSession(username);
  if (!saved) throw new Error("Sessão não encontrada");

  const ig = await createClient(username, saved.proxy || null);
  await ig.state.deserialize(saved);
  return ig;
}

module.exports = {
  loginWithPassword,
  resumeSession,
};
