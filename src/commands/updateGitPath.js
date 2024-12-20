const vscode = require('vscode');
const { setGitPath, getGitPath } = require('../utils/config');

async function updateGitPath() {
    try {
        const currentPath = getGitPath();
        
        const newPath = await vscode.window.showInputBox({
            placeHolder: 'Enter new git repository URL',
            prompt: 'Enter the URL of the Nylo repository to use for new projects',
            value: currentPath
        });

        if (!newPath) {
            return; // User cancelled
        }

        await setGitPath(newPath);
        vscode.window.showInformationMessage('Git repository path updated successfully');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to update git path: ${error.message}`);
    }
}

module.exports = {
    updateGitPath
};
