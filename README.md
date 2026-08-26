# @pipeworx/gnomad

[gnomAD](https://gnomad.broadinstitute.org) MCP — Genome Aggregation Database (Broad Institute) public GraphQL endpoint. Population allele frequencies + variant pathogenicity annotations. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/gnomad/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Gnomad data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
