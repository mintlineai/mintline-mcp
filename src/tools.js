export const tools = [
  {
    name: "list_receipts",
    description: "List receipts with optional filtering. Use this to find receipts by vendor name, date range, or match status.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search by vendor name",
        },
        status: {
          type: "string",
          enum: ["all", "matched", "unmatched", "hidden"],
          description: "Filter by match status",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "get_receipt",
    description: "Get detailed information about a specific receipt including line items and matched transaction.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Receipt ID (e.g., rcpt_01abc123)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_transactions",
    description: "List bank transactions with optional filtering. Use this to find transactions by description or match status.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search by transaction description",
        },
        status: {
          type: "string",
          enum: ["all", "matched", "unmatched", "hidden"],
          description: "Filter by match status",
        },
        statementId: {
          type: "string",
          description: "Filter by bank statement ID",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "get_transaction",
    description: "Get detailed information about a specific bank transaction.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Transaction ID (e.g., btxn_01abc123)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_statements",
    description: "List uploaded bank statements.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "list_matches",
    description: "List proposed matches between receipts and transactions. Use this to review matches that need confirmation.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["proposed", "confirmed", "rejected"],
          description: "Filter by match status (default: proposed)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "confirm_match",
    description: "Confirm a proposed match between a receipt and transaction. This links them together permanently.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Match ID to confirm",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "reject_match",
    description: "Reject a proposed match. The receipt and transaction will not be suggested as a match again.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Match ID to reject",
        },
        reason: {
          type: "string",
          description: "Optional reason for rejection",
        },
      },
      required: ["id"],
    },
  },
];

export async function handleTool(client, name, args) {
  switch (name) {
    case "list_receipts": {
      const result = await client.listReceipts({
        search: args.search,
        status: args.status,
        limit: args.limit || 20,
      });
      return formatReceipts(result.data);
    }

    case "get_receipt": {
      const result = await client.getReceipt(args.id);
      return formatReceiptDetail(result.data);
    }

    case "list_transactions": {
      const result = await client.listTransactions({
        search: args.search,
        status: args.status,
        statementId: args.statementId,
        limit: args.limit || 20,
      });
      return formatTransactions(result.data);
    }

    case "get_transaction": {
      const result = await client.getTransaction(args.id);
      return formatTransaction(result.data);
    }

    case "list_statements": {
      const result = await client.listStatements({
        limit: args.limit || 20,
      });
      return formatStatements(result.data);
    }

    case "list_matches": {
      const result = await client.listMatches({
        status: args.status || "proposed",
        limit: args.limit || 20,
      });
      return formatMatches(result.data);
    }

    case "confirm_match": {
      await client.confirmMatch(args.id);
      return `Match ${args.id} confirmed successfully.`;
    }

    case "reject_match": {
      await client.rejectMatch(args.id, args.reason);
      return `Match ${args.id} rejected.${args.reason ? ` Reason: ${args.reason}` : ""}`;
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function formatReceipts(receipts) {
  if (!receipts?.length) return "No receipts found.";

  return receipts.map((r) =>
    `• ${r.id}: ${r.vendor?.name || r.vendorName || "Unknown"} - ${r.totalAmount || "?"} ${r.currency || ""} (${r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString() : "no date"})`
  ).join("\n");
}

function formatReceiptDetail(r) {
  let text = `Receipt: ${r.id}\n`;
  text += `Vendor: ${r.vendor?.name || r.vendorName || "Unknown"}\n`;
  text += `Date: ${r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString() : "N/A"}\n`;
  text += `Total: ${r.totalAmount || "?"} ${r.currency || ""}\n`;

  if (r.items?.length) {
    text += `\nLine Items:\n`;
    r.items.forEach((item) => {
      text += `  • ${item.description}: ${item.totalPrice}\n`;
    });
  }

  if (r.matchedTransaction) {
    text += `\nMatched to: ${r.matchedTransaction.id} - ${r.matchedTransaction.description}`;
  }

  return text;
}

function formatTransactions(transactions) {
  if (!transactions?.length) return "No transactions found.";

  return transactions.map((t) =>
    `• ${t.id}: ${t.description} - ${t.amount} ${t.currency || ""} (${t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : "no date"})`
  ).join("\n");
}

function formatTransaction(t) {
  let text = `Transaction: ${t.id}\n`;
  text += `Description: ${t.description}\n`;
  text += `Amount: ${t.amount} ${t.currency || ""}\n`;
  text += `Date: ${t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : "N/A"}\n`;
  text += `Type: ${t.transactionType || "N/A"}`;
  return text;
}

function formatStatements(statements) {
  if (!statements?.length) return "No statements found.";

  return statements.map((s) =>
    `• ${s.id}: ${s.institutionName} - ${s.statementDate ? new Date(s.statementDate).toLocaleDateString() : "no date"} (${s.transactionCount || 0} transactions)`
  ).join("\n");
}

function formatMatches(matches) {
  if (!matches?.length) return "No matches found.";

  return matches.map((m) =>
    `• ${m.id}: Receipt ${m.receiptId} ↔ Transaction ${m.transactionId} (${Math.round(m.confidenceScore * 100)}% confidence) [${m.status}]`
  ).join("\n");
}
