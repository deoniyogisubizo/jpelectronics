import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = 'jptech';

let client: MongoClient | null = null;
let db: Db | null = null;
let warming = false;                          // only one warmup attempt in-flight

// Pool + keep-alive so the Atlas socket is already open when the first panel fires.
// In MongoDB driver 7.x: pool options are top-level; TCP socket options (e.g.
// keepAliveInitialDelay) live directly at the root level too. A nested
// { socketOptions: { … } } object triggers MongoParseError.
const POOL_OPTS: MongoClientOptions = {
  // ── connection pool ──────────────────────────────────────────────────
  maxPoolSize: 10,
  minPoolSize: 1,
  maxConnecting: 2,
  maxIdleTimeMS: 30000,
  waitQueueTimeoutMS: 30000,
  // ── TCP keep-alive (top-level, no nesting) ──────────────────────────
  keepAliveInitialDelay: 5000,   // first keep-alive probe after 5 s of idle
};

/** Merge caller-specific options with the shared pool config. */
function buildOptions(callerOpts?: { timeoutMS?: number }): MongoClientOptions {
  return {
    ...POOL_OPTS,
    ...(callerOpts ?? {}),
  } as MongoClientOptions;
}

/** Create a fresh client attached to topology-closed listeners. */
function createClient(opts: MongoClientOptions): MongoClient {
  const c = new MongoClient(MONGODB_URI, opts);
  c.on('topologyClosed', () => {
    client = null;
    db = null;
  });
  return c;
}

export async function connectToDatabase(options?: { timeoutMS?: number }): Promise<Db> {
  // If we have a client ref, ask for a fresh Db handle — this validates the
  // topology is still alive (throws MongoTopologyClosedError otherwise).
  if (client) {
    const freshDb = client.db(MONGODB_DB_NAME);
    if (freshDb) return freshDb;
  }
  // Fall through to create a brand-new connection.

  client = createClient(buildOptions(options));
  await client.connect();
  db = client.db(MONGODB_DB_NAME);
  return db;
}

// Warm up the connection pool asynchronously — never blocks the caller.
// Safe to call repeatedly; only one actual connection attempt runs.
export async function warmupConnection(): Promise<boolean> {
  if (client && db) return true;
  if (warming) return false;
  warming = true;
  try {
    await connectToDatabase({ timeoutMS: 8000 });
    return true;
  } catch (_e) {
    // If connect failed, clear the partially-created client so the next
    // call starts fresh instead of reusing a broken connection.
    if (client && !db) {
      client = null;
    }
    return false;
  } finally {
    warming = false;
  }
}

// Expose raw handles (needed by /api/ping route).
export { client, db };
