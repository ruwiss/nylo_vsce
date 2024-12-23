const vscode = require("vscode");
const { exec } = require("node:child_process");
const { getGitPath } = require("../utils/config");
const fs = require("node:fs");
const path = require("node:path");

function formatProjectName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function replaceInFile(filePath, searchPattern, replaceValue) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const pattern = typeof searchPattern === "string" ? searchPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : searchPattern;

  const regex = new RegExp(pattern, "g");
  const updatedContent = fileContent.replace(regex, replaceValue);

  fs.writeFileSync(filePath, updatedContent, "utf8");
}

async function createProject() {
  try {
    const projectName = await vscode.window.showInputBox({
      placeHolder: "Enter project name",
      prompt: "This will be used as the directory name for your new project",
    });

    if (!projectName) {
      return; // User cancelled
    }

    const formattedName = formatProjectName(projectName);
    const gitPath = getGitPath();
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder is open.");
      return;
    }

    const targetDirectory = workspaceFolders[0].uri.fsPath;
    const clonePath = `${targetDirectory}/${formattedName}`;

    const packageName = await vscode.window.showInputBox({
      placeHolder: "com.nylo.android",
      prompt: "Enter package name for the project",
    });

    if (!packageName) {
      return; // User cancelled
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Creating Nylo project: ${formattedName}`,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: "Cloning repository..." });

        return new Promise((resolve, reject) => {
          exec(`git clone ${gitPath} ${clonePath}`, (error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        });
      }
    );

    // Git klasörlerini sil
    const gitFolderPath = path.join(clonePath, ".git");
    const githubFolderPath = path.join(clonePath, ".github");

    try {
      if (fs.existsSync(gitFolderPath)) {
        fs.rmSync(gitFolderPath, { recursive: true, force: true });
      }

      if (fs.existsSync(githubFolderPath)) {
        fs.rmSync(githubFolderPath, { recursive: true, force: true });
      }
    } catch (error) {
      console.error("Git klasörleri silinirken hata oluştu:", error);
    }

    // Update files with the new package name and project name
    const gradleFilePath = path.join(clonePath, "android", "app", "build.gradle");
    const mainActivityPath = path.join(clonePath, "android", "app", "src", "main", "kotlin", "com", "nylo", "android", "MainActivity.kt");
    const manifestPath = path.join(clonePath, "android", "app", "src", "main", "AndroidManifest.xml");
    const envFilePath = path.join(clonePath, ".env");

    replaceInFile(gradleFilePath, "com.nylo.android", packageName);
    replaceInFile(mainActivityPath, "com.nylo.android", packageName);
    replaceInFile(manifestPath, 'android:label="Nylo"', `android:label="${projectName}"`);
    replaceInFile(envFilePath, 'APP_NAME="Nylo"', `APP_NAME="${projectName}"`);

    // pubspec.yaml dosyasını güncelle
    const pubspecPath = path.join(clonePath, "pubspec.yaml");
    if (fs.existsSync(pubspecPath)) {
      try {
        const pubspecContent = fs.readFileSync(pubspecPath, "utf8");
        const updatedPubspec = pubspecContent.replace(/^name:.*$/m, `name: ${formattedName}`);
        fs.writeFileSync(pubspecPath, updatedPubspec, "utf8");
      } catch (error) {
        console.error("pubspec.yaml güncellenirken hata oluştu:", error);
      }
    }

    // VS Code'un git extension'ının yeniden yüklenmesi için biraz bekle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Run Dart command after setup
    await new Promise((resolve, reject) => {
      exec("dart run nylo_framework:main", { cwd: clonePath }, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    vscode.window.showInformationMessage(`Successfully created project: ${formattedName}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create project: ${error.message}`);
  }
}

module.exports = {
  createProject,
};
