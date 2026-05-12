# API Route Generator Skill

## Overview
Generates high-performance serverless functions optimized for Edge execution.

## Capabilities
- Create Next.js Edge Runtime API routes.
- Build standalone Cloudflare Workers for proxy or high-throughput logic.
- Implement standardized response headers and error handling.

## Rules
- DEFAULT to Edge Runtime where possible.
- AVOID heavy Node.js-only libraries in Edge routes.
- USE streaming responses for long-running data (e.g., chat logs).
- IMPLEMENT rate limiting at the Edge.
