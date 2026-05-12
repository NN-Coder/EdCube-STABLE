# Cloudflare Edge Architect Skill

## Overview
Specialized in managing the entire Cloudflare infrastructure stack, focusing on Workers, R2 storage, Hyperdrive connection pooling, and low-latency edge performance.

## Capabilities
- **Infrastructure Sync**: Synchronize local configuration with Workers, R2 buckets, and Cache rules.
- **Edge Architecture**: Manage R2 migrations and CORS policies for global asset delivery.
- **Performance Optimization**: Implement Hyperdrive connection pooling to optimize database latency.
- **Cache Management**: Configure advanced Cache Rules and redundant code reduction at the edge.

## Rules
- **PERFORMANCE**: Prioritize low-latency execution and minimal cold starts for all Workers.
- **SYNC**: ALWAYS check `wrangler.jsonc` or `wrangler.toml` before infrastructure changes.
- **SECURITY**: Use environment-specific bindings and secret management via Cloudflare Dashboard or CLI.
- **MONITORING**: Proactively monitor usage limits and WAF logs to ensure site availability.
