# Mintline MCP Server

Connect AI assistants to your Mintline receipts and transactions via the [Model Context Protocol](https://modelcontextprotocol.io).

[![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue)](https://registry.modelcontextprotocol.io/servers/io.github.mintlineai/mintline-mcp)
[![mcp.so](https://img.shields.io/badge/mcp.so-Listed-green)](https://mcp.so/server/mintline-mcp)
[![npm](https://img.shields.io/npm/v/@mintline/mcp)](https://www.npmjs.com/package/@mintline/mcp)

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

### Receipts & Transactions

| Tool | Description |
|------|-------------|
| `list_receipts` | Search and filter receipts by vendor name, date range, or match status |
| `get_receipt` | Get detailed receipt info including line items and matched transaction |
| `list_transactions` | Search and filter bank transactions by description or status |
| `get_transaction` | Get detailed transaction information |
| `list_statements` | List uploaded bank statements |

### Matching

| Tool | Description |
|------|-------------|
| `list_matches` | View proposed matches between receipts and transactions |
| `confirm_match` | Confirm a proposed match (links receipt to transaction permanently) |
| `reject_match` | Reject a proposed match (won't be suggested again) |

### Analytics

| Tool | Description |
|------|-------------|
| `spending_summary` | Get spending totals with flexible grouping (total, vendor, month, week, day) |
| `top_vendors` | Get top vendors ranked by total spending |
| `spending_trends` | Get monthly spending trends over time |
| `unmatched_summary` | Get summary of items needing attention (unmatched receipts, transactions, proposed matches) |

## Tool Parameters

### list_receipts
- `search` (string) - Search by vendor name
- `status` (string) - Filter: "all", "matched", "unmatched", "hidden"
- `limit` (number) - Max results (default: 20)

### list_transactions
- `search` (string) - Search by transaction description
- `status` (string) - Filter: "all", "matched", "unmatched", "hidden"
- `statementId` (string) - Filter by bank statement ID
- `limit` (number) - Max results (default: 20)

### list_matches
- `status` (string) - Filter: "proposed", "confirmed", "rejected" (default: proposed)
- `limit` (number) - Max results (default: 20)

### spending_summary
- `groupBy` (string) - "total", "vendor", "month", "week", "day" (default: total)
- `dateFrom` (string) - Start date (YYYY-MM-DD)
- `dateTo` (string) - End date (YYYY-MM-DD)
- `vendorId` (string) - Filter by specific vendor
- `limit` (number) - Max results for grouped queries (default: 20)

### top_vendors
- `limit` (number) - Number of vendors to return (default: 10)

### spending_trends
- `months` (number) - Number of months to include (default: 6)

## Example Prompts

### Receipts & Transactions
- "Show me my unmatched receipts"
- "Find receipts from Amazon"
- "List transactions from my Chase statement"
- "Show details for receipt rcpt_01abc123"

### Matching
- "What matches need my review?"
- "Confirm the top match"
- "Reject match mtch_01xyz789 - wrong vendor"

### Analytics
- "How much did I spend this month?"
- "What are my top vendors by spending?"
- "Show me spending trends for the last 6 months"
- "Break down my spending by week"
- "How much did I spend at AWS last quarter?"
- "What needs my attention?" (shows unmatched items)
- "Do I have any large transactions without receipts?"

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
