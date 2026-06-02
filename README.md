# mcp-gnomad

gnomAD MCP — Broad Institute Genome Aggregation Database (GraphQL).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `variant` | Variant by chr-pos-ref-alt (e.g. "1-55051215-G-A") or rsid. |
| `gene` | Gene info + variants. Accepts gene symbol (e.g. "BRCA1") or Ensembl gene id. |
| `region` | Variants in a genomic region (≤25kb recommended). |
| `transcript` | Transcript + variants. |
| `search` | Gene / variant search (autocomplete). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "gnomad": {
      "url": "https://gateway.pipeworx.io/gnomad/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Gnomad data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
