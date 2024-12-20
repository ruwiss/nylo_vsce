# Nylo Framework VS Code Extension

A Visual Studio Code extension for streamlining Nylo framework development (Unofficial).

## Features

- **Project Creation**: Easily create new Nylo projects with a single command
- **Make Commands**: Quick access to all Nylo make commands through the command palette
- **Git Repository Management**: Update and manage your Nylo git repository path

## Commands

- `Nylo: Create Project` - Create a new Nylo project
- `Nylo: Update Git Repository Path` - Update the Git repository URL for project creation
- `Nylo: Make` - Access all make commands in one place:
  - make:page
  - make:model
  - make:controller
  - make:provider
  - make:middleware
  - And more...

## Requirements

- Visual Studio Code v1.96.0 or higher
- Dart SDK installed
- Git installed

## Usage

### Creating a New Project

1. Press `Ctrl+Shift+P` to open the command palette
2. Type "Nylo: Create Project"
3. Enter your project name when prompted
4. Wait for the project to be created

### Using Make Commands

1. Press `Ctrl+Shift+P`
2. Type "Nylo: Make"
3. Select the desired make command
4. Enter the required name/parameters

### Updating Git Repository Path

1. Press `Ctrl+Shift+P`
2. Type "Nylo: Update Git Repository Path"
3. Enter the new repository URL

## Configuration

The extension supports the following settings:

- `nylo.nyloGitPath`: Git repository URL for creating new Nylo projects (default: "https://github.com/nylo-core/nylo.git")

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License.

## Disclaimer

This is an unofficial extension and is not affiliated with the Nylo framework team.
