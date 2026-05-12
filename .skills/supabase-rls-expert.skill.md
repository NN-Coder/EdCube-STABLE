# Supabase RLS Expert Skill

## Overview
Expertise in auditing and writing Row Level Security (RLS) policies for Supabase/PostgreSQL. Focuses on ensuring user data isolation, chat history privacy, and secure admin access.

## Capabilities
- Audit existing tables for missing RLS policies (`supabase-mcp-server_get_advisors`).
- Write robust `USING` and `WITH CHECK` expressions.
- Implement complex policies using `auth.uid()`, `auth.email()`, and custom JWT claims.
- Validate policies against edge cases (anonymous access, service role overrides).

## Rules
- NEVER leave a table with RLS disabled in production.
- ALWAYS use `auth.uid()` for user-specific data.
- ENSURE `check` expressions are present for `INSERT` and `UPDATE` operations.
- DOCUMENT the intent of each policy in a migration comment.

## Reference
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
