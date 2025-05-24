const fs = require("fs");
const path = require("path");

const { IgApiClient } = require("instagram-private-api");

const SESSION_DIR = path.join(__dirname, "../../sessions");
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

function getSessionPath(username) {
  return path.join(SESSION_DIR, `${username}.json`);
}

function saveSession(username, session) {
  const filePath = getSessionPath(username);
  fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
}

function loadSession(username) {
  const filePath = getSessionPath(username);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function deleteSession(username) {
  const filePath = getSessionPath(username);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

function sessionExists(username) {
  return fs.existsSync(getSessionPath(username));
}

async function getSessionClient(username) {
  console.log("Recebido username em getSessionClient:", username); // ADICIONE ESTA LINHA

  const sessionData = loadSession(username);
  if (!sessionData) throw new Error("Sessão não encontrada");

  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  await ig.state.deserialize(sessionData);
  return ig;
}

module.exports = {
  saveSession,
  loadSession,
  deleteSession,
  sessionExists,
  getSessionClient,
};
