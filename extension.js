const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let interval;  // This will store the current interval so it can be cleared later.

function restartReminder() {
    if (interval) {
        clearInterval(interval);
    }

    // Get the user-defined interval or default to 30 minutes
    const intervalMinutes = vscode.workspace.getConfiguration('gitReminder').get('checkIntervalMinutes', 30);
    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    // Run the check immediately upon activation
    checkAndRemind();

    // Then set an interval based on user configuration or default
    interval = setInterval(checkAndRemind, intervalMilliseconds);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    restartReminder();

    context.subscriptions.push({
        dispose: () => {
            clearInterval(interval);  // Ensure that the interval is cleared when the extension is deactivated
        }
    });

    // Register the reload command
    let disposable = vscode.commands.registerCommand('gitReminder.reload', function () {
        restartReminder();
        vscode.window.showInformationMessage('Git Reminder reloaded with the new interval.');
    });
    context.subscriptions.push(disposable);
}

/**
 * Periodically checks the active VSCode workspace to determine:
 * 1. It is a Git repository.
 * 2. Whether there are any uncommitted changes in the repository. If so, the user is reminded to commit them.
 * 3. If there's a remote configured for the repository.
 * 4. Whether there are any local commits that haven't been pushed to the remote. If so, the user is reminded to push them.
 * 
 * If the workspace isn't a Git repository, or if the checks don't result in any actionable items, the function does nothing.
 * If multiple conditions are met (e.g., uncommitted changes and unpushed commits),
 * the function will exit after the first reminder to avoid overwhelming the user with multiple messages.
 *
 * @async
 * @function
 * @throws {Error} Throws an error if there's an issue checking git status, git remote, or unpushed commits.
 */
async function checkAndRemind() {
    // Get the active workspace.
    let workspaceFolders = vscode.workspace.workspaceFolders;

    // If there's no active workspace, simply exit.
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return;
    }

    let rootPath = workspaceFolders[0].uri.fsPath;

    if (isGitRepository(rootPath)) {
        try {
            // Check for uncommitted changes first.
            if (await hasUncommittedChanges(rootPath)) {
                vscode.window.showErrorMessage("You have uncommitted changes. Consider committing them!");
                return; // Exit early to avoid showing multiple messages at once
            }

            // Then check for remote and unpushed commits.
            if (await hasGitRemote(rootPath)) {
                if (await hasUnPushedCommits(rootPath)) {
                    vscode.window.showErrorMessage("You have local commits that haven't been pushed to the remote. Consider pushing them!");
                }
            }
        } catch (error) {
            handleError(error, context);
        }
    }
    // If not a git repo, the function silently exits.
}

function isGitRepository(directory) {
    return fs.existsSync(path.join(directory, '.git'));
}

/**
 * Checks if there are uncommitted changes in the repository.
 * @param {string} repoPath - The path to the git repository.
 * @returns {Promise<boolean>} - Resolves to true if there are uncommitted changes, false otherwise.
 */
function hasUncommittedChanges(repoPath) {
    return new Promise((resolve, reject) => {
        exec('git status --porcelain', { cwd: repoPath }, (err, stdout, _) => {
            if (err) {
                reject("Error checking for uncommitted changes. Ensure git is installed and the repository is initialized correctly.");
                return;
            }
            resolve(stdout.trim() !== "");
        });
    });
}

/**
 * Checks if there's a git remote added to the repository.
 * @param {string} repoPath - The path to the git repository.
 * @returns {Promise<boolean>} - Resolves to true if there's a remote, false otherwise.
 */
function hasGitRemote(repoPath) {
    return new Promise((resolve, reject) => {
        exec('git remote', { cwd: repoPath }, (err, stdout, _) => {
            if (err) {
                reject("Error checking git remote. Ensure git is installed and the repository is initialized correctly.");
                return;
            }
            resolve(stdout.trim() !== "");
        });
    });
}

/**
 * Checks if there are local commits yet to be pushed to the remote.
 * @param {string} repoPath - The path to the git repository.
 * @returns {Promise<boolean>} - Resolves to true if there are commits to be pushed, false otherwise.
 */
function hasUnPushedCommits(repoPath) {
    return new Promise((resolve, reject) => {
        exec('git log --branches --not --remotes', { cwd: repoPath }, (err, stdout, _) => {
            if (err) {
                reject("Error checking for unpushed commits. Ensure git is installed and the repository is initialized correctly.");
                return;
            }
            resolve(stdout.trim() !== "");
        });
    });
}

function handleError(error, context) {
    if (context.extensionMode === vscode.ExtensionMode.Development) {
        // In debug mode
        vscode.window.showErrorMessage(error.toString());
    } else {
        // In release mode
        console.log(error);
    }
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
