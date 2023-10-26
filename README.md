# Git Commit Reminder for VSCode

![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Introduction

From a project manager's perspective, keeping track of code changes and ensuring that they are committed and pushed to remote repositories timely is crucial. The Git Commit Reminder extension for Visual Studio Code is designed to aid developers in this task. With periodic checks, developers are reminded to commit uncommitted changes and push local commits, ensuring a streamlined workflow and minimizing the risk of unsaved or unshared work.

## Features

1. Periodically checks if you have uncommitted changes and reminds you to commit them.
2. If you have a remote repository set up, it checks for local commits that haven't been pushed and reminds you to push them.
3. Allows you to set a custom interval for the reminder. If not set, the default is 30 minutes.
4. Provides a command to reload the extension and apply any changes to the interval without restarting VSCode.

## Requirements

- Visual Studio Code
- Git installed on your machine

## Installation

1. Install the extension from the VSCode marketplace.
2. Reload VSCode after the installation is complete.

## Usage

1. By default, the extension will check for uncommitted and unpushed changes every 30 minutes.
2. You can change this interval by updating the `gitCommitReminder.checkIntervalMinutes` setting in VSCode settings.

### Changing the Reminder Interval

1. Open VSCode settings.
2. Search for "Git Commit Reminder".
3. Update the "Interval in minutes for Git Commit Reminder to check and send notifications" to your desired number of minutes.

### Manually Reloading the Extension

You can manually reload the extension after changing settings:

1. Open the command palette (Ctrl+Shift+P).
2. Search for "Reload Git Commit Reminder" and select it. This will restart the reminder with your updated settings.

## Configuration

```json
{
  "gitCommitReminder.checkIntervalMinutes": {
      "type": "number",
      "default": 30,
      "description": "Interval in minutes for Git Commit Reminder to check and send notifications."
  }
}
```

## Activation

The extension gets activated for any workspace that contains a `.git` directory.

## Known Issues

None currently. If you find any issues or have suggestions, please report them in the issues section of the repository.

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://opensource.org/license/mit/)
```

Note: This README assumes that the extension is open-source with an MIT license. Adjust the License section as needed based on your actual license.