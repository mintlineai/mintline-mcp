# Mintline MCP Server

Connect AI assistants to your Mintline receipts and transactions via the [Model Context Protocol](https://modelcontextprotocol.io).

## Installation

```bash
npm install -g @mintline/mcp
```

## Setup

### 1. Get your API key

Create an API key at [mintline.ai/app/settings/api-keys](https://mintline.ai/app/settings/api-keys)

### 2. Configure Claude Desktop

Add to your `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mintline": {
      "command": "mintline-mcp",
      "env": {
        "MINTLINE_API_KEY": "ml_live_your_api_key_here"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

The Mintline tools will now be available.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_receipts` | Search and filter receipts by vendor, status |
| `get_receipt` | Get receipt details with line items |
| `list_transactions` | Search and filter bank transactions |
| `get_transaction` | Get transaction details |
| `list_statements` | List uploaded bank statements |
| `list_matches` | View proposed receipt-transaction matches |
| `confirm_match` | Confirm a proposed match |
| `reject_match` | Reject a proposed match |

## Example Prompts

- "Show me my unmatched receipts"
- "Find receipts from Amazon"
- "What transactions need matching?"
- "Confirm the top match"
- "Show details for receipt rcpt_01abc123"

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MINTLINE_API_KEY` | Yes | Your Mintline API key |
| `MINTLINE_API_URL` | No | API URL (default: https://api.mintline.ai) |

## Development

```bash
git clone https://github.com/mintlineai/mintline-mcp.git
cd mintline-mcp
npm install

# Run locally
MINTLINE_API_KEY=ml_live_... node src/index.js
```

## License

MIT
