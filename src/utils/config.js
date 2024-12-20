const vscode = require("vscode");

const CONFIG_KEY = "nyloGitPath";
const DEFAULT_GIT_PATH = "https://github.com/nylo-core/nylo.git";

function getGitPath() {
  const config = vscode.workspace.getConfiguration("nylo");
  return config.get(CONFIG_KEY, DEFAULT_GIT_PATH);
}

async function setGitPath(path) {
  const config = vscode.workspace.getConfiguration("nylo");
  await config.update(CONFIG_KEY, path, true);
}

module.exports = {
  getGitPath,
  setGitPath,
  DEFAULT_GIT_PATH,
};
