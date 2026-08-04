# @pipeworx/gnomad

[gnomAD](https://gnomad.broadinstitute.org) MCP — Genome Aggregation Database (Broad Institute) public GraphQL endpoint. Population allele frequencies + variant pathogenicity annotations. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `variant(variant_id, dataset?)` — by `chr-pos-ref-alt` (e.g. `1-55051215-G-A`) or rsid
- `gene(gene_symbol_or_id, dataset?)` — variants in / near a gene
- `region(chrom, start, stop, dataset?)` — variants in a genomic region
- `transcript(transcript_id, dataset?)` — variants in / near a transcript
- `search(query)` — gene / variant search (autocomplete)

`dataset` defaults to `gnomad_r4` (most recent release). Other valid: `gnomad_r3`, `gnomad_r2_1`, `gnomad_sv_r4`, etc.

## Data source

`https://gnomad.broadinstitute.org/api`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
