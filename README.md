# subriva-testapp

The end-to-end test fixture for [Subriva Deploy](https://github.com/dilli2127/deploy-agent).

It is a single-file Node HTTP server with **no dependencies, no build step and no database**. That
is the whole design: anything that goes red while deploying this belongs to the platform, not to
the app. A fixture that could fail on its own is useless for finding platform bugs.

| Route     | Returns                                             |
| --------- | --------------------------------------------------- |
| `/health` | `{"status":"ok","version":"<APP_VERSION>"}`         |
| `/`       | adds `greeting`, read from the `GREETING` secret    |

`GREETING` is declared `required` in [subriva.deploy.yml](subriva.deploy.yml) and is never stored
here — it comes from the environment's secrets in Subriva Deploy. Reading it back from `/` is what
proves the secret path works end to end, rather than only proving a file was written.

`APP_VERSION` is a build arg surfaced at `/health`, so two releases are visibly distinguishable —
which is what makes a rollback observable rather than merely reported.

## Deploying it

Registered in Subriva Deploy as project slug `testapp`. The contract expects the container
`subriva-testapp-local-app-1`, i.e. environment `local`; deploying it to a differently-named
environment means updating `deploy.containers` to match.

## Running it by hand

```bash
GREETING='hello' APP_VERSION=dev docker compose up -d --build
curl http://127.0.0.1:8081/health
```
