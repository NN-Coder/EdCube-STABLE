<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# EdCube Agent Operational Protocol

This document serves as the primary instruction set for all AI agents working on the EdCube repository. All actions must align with the following guidelines to maintain site integrity, user security, and cost efficiency.

## 🎯 Core Mission
Scale **EdCube** into a high-performance, unblocked gaming platform while maintaining a low-latency, free-tier-optimized infrastructure using Next.js 16, Cloudflare, and Supabase.

## 🧠 Reasoning & Thinking Process
*   **Sequential Thinking MCP:** For all complex changes, database migrations, or other tasks, the agent **MUST** utilize the `sequential-thinking` MCP server. Break down all tasks into discrete logical steps and validate each step before proceeding.
*   **Conflict Resolution:** Always refer to `roadmap.md` to check the priority and status of a task before starting. Proactively update the status of tasks (e.g., changing [INPROGRESS] to [DONE]) upon successful implementation.

## 🛠️ MCP & Skill Utilization
The agent is authorized to use the following MCP servers and skills as appropriate:
*   **Filesystem MCP:** For local repo management.
*   **GitHub MCP:** For repo management and PR automation.
*   **Specialized Skills:**
    *   `supabase-rls-expert`: Auditing and writing secure database policies.
    *   `cloudflare-edge-architect`: Managing Workers, R2, and Hyperdrive connection pooling.
    *   `ai-integration-engineer`: Implementing Gemini Pro and Cloudflare Workers AI.
    *   `audit-specialist`: Comprehensive performance, security, and UI/UX audits.
    *   `tailwind-layout-master`: Building responsive and customized UI engines.
    *   `api-route-generator`: Creating high-performance edge serverless functions.
    *   `seo-metadata-optimizer`: Automating dynamic meta-tag generation.
    *   `ui-validator`: Ensuring visual consistency and accessibility.
    *   `legal-policy-generator`: Drafting compliant legal and policy documentation.
    *   `secret-leak-detector`: Scanning for exposed credentials and secrets.
    *   `git-semantic-committer`: Standardizing commits with semantic versioning.
    *   `discord-webhook-architect`: Automating community and dev communications.
    *   `documentation-sync-agent`: Maintaining consistency across internal and external docs.
    *   `lighthouse-performance-agent`: Targeted performance and SEO audits.

---

## 🚧 Operational Guardrails

### 1. Security & Permissions (Hard Pause)
*   **Check with User:** The agent is **STRICTLY PROHIBITED** from modifying the following without explicit user approval in the chat:
    *   `.gitignore` or `.env` file structures.
    *   Supabase Row Level Security (RLS) policies.
    *   Authentication workflows (Auth v1).
*   **Secret Management:** Always use the `secret-leak-detector` skill to verify no secrets or API keys are exposed in the Git history or code.

### 2. Infrastructure & Free-Tier Monitoring
*   **Limit Checks:** Before proposing any infrastructure change (e.g., R2 migrations or Workers deployment), the agent must evaluate if the change risks exceeding **Cloudflare** or **Supabase** free-tier limits (e.g., R2 egress fees, Worker request limits, Supabase DB size).
*   **Optimization First:** Prioritize horizontal scaling and caching (via Cloudflare Cache Rules and Hyperdrive) over vertical scaling or paid upgrades.

### 3. Copywriting & Tone
*   **Simplicity Rule:** Keep site wording clear, concise, and student-friendly. Avoid overly complex terminology or "corporate" phrasing on the front-end.
*   **Aesthetics First**: Every UI change must follow the high-performance, premium cyberpunk/space aesthetic defined in the design system.

---

## 📈 Success Metrics
*   **Low Latency:** Sub-10ms response times for edge workers.
*   **Persistence:** Accurate cross-domain data syncing for user accounts.
*   **Compliance:** Fully functional and automated DMCA/Legal handling.

---
*Reference [roadmap.md](file:///c:/Users/Neil/Documents/GitHub/EdCube-STABLE/docs/roadmap.md) for current task priorities.*