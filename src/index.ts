interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * gnomAD MCP — Broad Institute Genome Aggregation Database (GraphQL).
 *
 * Auth: none. Docs: https://gnomad.broadinstitute.org/api
 */


const ENDPOINT = 'https://gnomad.broadinstitute.org/api';
const UA = 'pipeworx-mcp-gnomad/1.0 (+https://pipeworx.io)';
const DEFAULT_DATASET = 'gnomad_r4';

const tools: McpToolExport['tools'] = [
  {
    name: 'variant',
    description: 'Variant by chr-pos-ref-alt (e.g. "1-55051215-G-A") or rsid.',
    inputSchema: {
      type: 'object',
      properties: {
        variant_id: { type: 'string' },
        dataset: { type: 'string', description: `Default ${DEFAULT_DATASET}.` },
      },
      required: ['variant_id'],
    },
  },
  {
    name: 'gene',
    description: 'Gene info + variants. Accepts gene symbol (e.g. "BRCA1") or Ensembl gene id.',
    inputSchema: {
      type: 'object',
      properties: {
        gene_symbol_or_id: { type: 'string' },
        dataset: { type: 'string' },
      },
      required: ['gene_symbol_or_id'],
    },
  },
  {
    name: 'region',
    description: 'Variants in a genomic region (≤25kb recommended).',
    inputSchema: {
      type: 'object',
      properties: {
        chrom: { type: 'string', description: 'e.g. "1", "X", "MT"' },
        start: { type: 'number' },
        stop: { type: 'number' },
        dataset: { type: 'string' },
      },
      required: ['chrom', 'start', 'stop'],
    },
  },
  {
    name: 'transcript',
    description: 'Transcript + variants.',
    inputSchema: {
      type: 'object',
      properties: {
        transcript_id: { type: 'string', description: 'Ensembl transcript id (ENST…)' },
        dataset: { type: 'string' },
      },
      required: ['transcript_id'],
    },
  },
  {
    name: 'search',
    description: 'Gene / variant search (autocomplete).',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const dataset = (args.dataset as string | undefined) ?? DEFAULT_DATASET;
  switch (name) {
    case 'variant':
      return gql(
        `query($v:String!,$ds:DatasetId!){
          variant(variantId:$v,dataset:$ds){
            variant_id rsids reference_genome chrom pos ref alt
            exome { ac an af homozygote_count populations { id ac an af } }
            genome { ac an af homozygote_count populations { id ac an af } }
            transcript_consequences { gene_symbol gene_id transcript_id consequence_terms is_canonical hgvsc hgvsp }
            clinvar { clinical_significance gold_stars submissions { clinical_significance review_status } }
          }
        }`,
        { v: reqStr(args, 'variant_id', '"1-55051215-G-A"'), ds: dataset },
      );
    case 'gene':
      return gql(
        `query($q:String!,$ds:DatasetId!){
          gene_search(query:$q,reference_genome:GRCh38){ ensembl_id symbol }
          gene(gene_symbol:$q,reference_genome:GRCh38){
            gene_id symbol name chrom start stop strand
            variants(dataset:$ds){ variant_id rsids consequence hgvsc hgvsp exome { ac an af } genome { ac an af } }
          }
        }`,
        { q: reqStr(args, 'gene_symbol_or_id', '"BRCA1"'), ds: dataset },
      );
    case 'region':
      return gql(
        `query($chrom:String!,$start:Int!,$stop:Int!,$ds:DatasetId!){
          region(chrom:$chrom,start:$start,stop:$stop,reference_genome:GRCh38){
            variants(dataset:$ds){ variant_id rsids consequence exome { ac an af } genome { ac an af } }
          }
        }`,
        {
          chrom: reqStr(args, 'chrom', '"1"'),
          start: (args.start as number) | 0,
          stop: (args.stop as number) | 0,
          ds: dataset,
        },
      );
    case 'transcript':
      return gql(
        `query($id:String!,$ds:DatasetId!){
          transcript(transcript_id:$id,reference_genome:GRCh38){
            transcript_id gene_symbol chrom start stop
            variants(dataset:$ds){ variant_id consequence exome { af } genome { af } }
          }
        }`,
        { id: reqStr(args, 'transcript_id', '"ENST00000357654"'), ds: dataset },
      );
    case 'search':
      return gql(
        `query($q:String!){
          gene_search(query:$q,reference_genome:GRCh38){ ensembl_id symbol }
        }`,
        { q: reqStr(args, 'query', '"BRCA"') },
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function gql(query: string, variables: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`gnomAD: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  const json = (await res.json()) as { data?: unknown; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`gnomAD GraphQL: ${json.errors.map((e) => e.message).join('; ')}`);
  return json.data;
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
