/**
 * The smallest thing that is still a real deployment target.
 *
 * It exists to exercise Subriva Deploy end to end — build, release, health-check, rollback — so it
 * deliberately has no dependencies, no database and no build step. Anything that breaks while
 * deploying this is the platform's fault, which is the entire point of the fixture.
 */

import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 8081);

// Set at build time so a deployment is visibly distinguishable from the one before it.
const version = process.env.APP_VERSION ?? 'dev';

// Proves that the environment Subriva Deploy writes actually reaches the process.
const greeting = process.env.GREETING ?? '(GREETING was not set)';

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (url.pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok', version }));
    return;
  }

  if (url.pathname === '/') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ app: 'subriva-testapp', version, greeting }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`subriva-testapp ${version} listening on ${port}`);
});

// Compose stops containers with SIGTERM. Exiting promptly keeps `recreate` fast.
process.on('SIGTERM', () => server.close(() => process.exit(0)));
