// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { createProject } = require("./src/commands/createProject");
const { updateGitPath } = require("./src/commands/updateGitPath");
const { exec } = require("node:child_process");

/**
 * @param {vscode.ExtensionContext} context
 */
function registerNyloCommand(context, commandId, commandName) {
  const command = vscode.commands.registerCommand(commandId, async () => {
    const name = await vscode.window.showInputBox({
      placeHolder: `Enter name for ${commandName}`,
      prompt: `Provide a name for the ${commandName}`,
    });

    if (!name) {
      return; // User cancelled
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder is open.");
      return;
    }

    const targetDirectory = workspaceFolders[0].uri.fsPath;

    await new Promise((resolve, reject) => {
      exec(`dart run nylo_framework:main ${commandName} ${name}`, { cwd: targetDirectory }, (error) => {
        if (error) {
          vscode.window.showErrorMessage(`Failed to execute command: ${error.message}`);
          reject(error);
          return;
        }
        vscode.window.showInformationMessage(`Command executed successfully: ${commandName} ${name}`);
        resolve();
      });
    });
  });

  context.subscriptions.push(command);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Nylo extension is now active!");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const createProjectCommand = vscode.commands.registerCommand("nylo.createProject", createProject);
  const updateGitPathCommand = vscode.commands.registerCommand("nylo.updateGitPath", updateGitPath);

  context.subscriptions.push(createProjectCommand);
  context.subscriptions.push(updateGitPathCommand);

  // Register Nylo Make command
  const makeCommands = [
    { label: "make:page", description: "Create a new page" },
    { label: "make:page (with controller)", description: "Create a new page with controller", value: "make:page", withController: true },
    { label: "make:stateful_widget", description: "Create a new stateful widget" },
    { label: "make:stateless_widget", description: "Create a new stateless widget" },
    { label: "make:state_managed_widget", description: "Create a new state managed widget" },
    { label: "make:navigation_hub", description: "Create a new navigation hub" },
    { label: "make:form", description: "Create a new form" },
    { label: "make:model", description: "Create a new model" },
    { label: "make:provider", description: "Create a new provider" },
    { label: "make:api_service", description: "Create a new API service" },
    { label: "make:controller", description: "Create a new controller" },
    { label: "make:event", description: "Create a new event" },
    { label: "make:theme", description: "Create a new theme" },
    { label: "make:route_guard", description: "Create a new route guard" },
    { label: "make:config", description: "Create a new config" },
    { label: "make:interceptor", description: "Create a new interceptor" },
  ];

  const nyloMakeCommand = vscode.commands.registerCommand("nylo.make", async () => {
    const selectedCommand = await vscode.window.showQuickPick(makeCommands, {
      placeHolder: "Select a command to execute",
    });

    if (!selectedCommand) {
      return; // User cancelled
    }

    const name = await vscode.window.showInputBox({
      placeHolder: `Enter name for ${selectedCommand.label}`,
      prompt: `Provide a name for the ${selectedCommand.label}`,
    });

    if (!name) {
      return; // User cancelled
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder is open.");
      return;
    }

    const targetDirectory = workspaceFolders[0].uri.fsPath;
    const command = selectedCommand.value || selectedCommand.label;
    const controllerFlag = selectedCommand.withController ? " --controller" : "";

    await new Promise((resolve, reject) => {
      exec(`dart run nylo_framework:main ${command} ${name}${controllerFlag}`, { cwd: targetDirectory }, (error) => {
        if (error) {
          vscode.window.showErrorMessage(`Failed to execute command: ${error.message}`);
          reject(error);
          return;
        }
        vscode.window.showInformationMessage(`Command executed successfully: ${command} ${name}${controllerFlag}`);
        resolve();
      });
    });
  });

  context.subscriptions.push(nyloMakeCommand);

  // Register Nylo commands
  const widgetCommands = [
    { label: "make:page", description: "Create a new page" },
    { label: "make:page (with controller)", description: "Create a new page with controller", value: "make:page", withController: true },
    { label: "make:stateful_widget", description: "Create a new stateful widget" },
    { label: "make:stateless_widget", description: "Create a new stateless widget" },
    { label: "make:state_managed_widget", description: "Create a new state managed widget" },
    { label: "make:navigation_hub", description: "Create a new navigation hub" },
    { label: "make:form", description: "Create a new form" },
  ];

  const appCommands = [
    { label: "make:model", description: "Create a new model" },
    { label: "make:provider", description: "Create a new provider" },
    { label: "make:api_service", description: "Create a new API service" },
    { label: "make:controller", description: "Create a new controller" },
    { label: "make:event", description: "Create a new event" },
    { label: "make:theme", description: "Create a new theme" },
    { label: "make:route_guard", description: "Create a new route guard" },
    { label: "make:config", description: "Create a new config" },
    { label: "make:interceptor", description: "Create a new interceptor" },
  ];

  for (const cmd of widgetCommands) {
    registerNyloCommand(context, `nylo.${cmd.label}`, cmd.label);
  }

  for (const cmd of appCommands) {
    registerNyloCommand(context, `nylo.${cmd.label}`, cmd.label);
  }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
