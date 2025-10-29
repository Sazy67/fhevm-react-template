# Universal FHEVM SDK CLI Usage

The Universal FHEVM SDK includes a command-line interface (CLI) tool that makes it easy to work with FHE operations without writing code.

## Installation

To use the CLI, first install the package globally:

```bash
npm install -g @fhevm-sdk
```

Or run it directly using npx:

```bash
npx @fhevm-sdk
```

## Commands

### Initialize a new FHEVM project

```bash
fhevm-sdk init --name my-fhevm-project --framework react
```

Options:
- `-n, --name <name>`: Project name (default: "fhevm-project")
- `-f, --framework <framework>`: Framework (react, vue, node) (default: "react")

### Encrypt a value

```bash
fhevm-sdk encrypt 42 --type number
```

Arguments:
- `<value>`: Value to encrypt

Options:
- `-t, --type <type>`: Type of value (number, boolean, address) (default: "number")

### Decrypt a handle

```bash
fhevm-sdk decrypt encrypted_handle_string
```

Arguments:
- `<handle>`: Handle to decrypt

### Display environment information

```bash
fhevm-sdk info
```

Shows information about the current environment, SDK version, and storage availability.

### Manage storage

```bash
# Set a key-value pair
fhevm-sdk storage --set mykey=myvalue

# Get a value by key
fhevm-sdk storage --get mykey

# Remove a key
fhevm-sdk storage --remove mykey
```

Options:
- `-s, --set <key=value>`: Set a key-value pair
- `-g, --get <key>`: Get a value by key
- `-r, --remove <key>`: Remove a key

## Examples

### Quick setup (less than 10 lines)

1. Initialize a new React project:
```bash
fhevm-sdk init --name my-fhevm-app --framework react
cd my-fhevm-app
```

2. Encrypt a number:
```bash
fhevm-sdk encrypt 123 --type number
```

3. Check environment info:
```bash
fhevm-sdk info
```

4. Store a value:
```bash
fhevm-sdk storage --set counter=0
```

5. Retrieve the value:
```bash
fhevm-sdk storage --get counter
```

## Using with npx

You can use the CLI without installing it globally:

```bash
# Initialize a project
npx @fhevm-sdk init --name my-project

# Encrypt a value
npx @fhevm-sdk encrypt 42

# Get info
npx @fhevm-sdk info
```

## Programmatic Usage

You can also use the CLI programmatically in your scripts:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');

// Initialize a project
execSync('fhevm-sdk init --name my-project --framework vue', { stdio: 'inherit' });

// Encrypt a value
execSync('fhevm-sdk encrypt 123 --type number', { stdio: 'inherit' });

// Get info
execSync('fhevm-sdk info', { stdio: 'inherit' });
```

## Troubleshooting

### Common Issues

1. **"command not found"**: Make sure the package is installed globally or use npx.

2. **Permission errors**: On some systems, you might need to run with sudo:
```bash
sudo npm install -g @fhevm-sdk
```

3. **Node.js version**: Make sure you're using Node.js >= 18.0.0.

### Getting Help

For help with any command, use the `--help` flag:

```bash
fhevm-sdk --help
fhevm-sdk init --help
fhevm-sdk encrypt --help
```