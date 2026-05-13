# EdCube Development Roadmap

This document outlines the strategic progression for EdCube. The roadmap is prioritized from mission-critical infrastructure and core user features to advanced engagement tools and optimization suites.

*Items are listed in order of implementation priority with certain not priority exceptions.*

**Key:**
    * [DONE] - Task is fully complete and implemented with little to no minor bugs/issues
    * [INPROGRESS] - Task is still in the process of implementation
    * [BACKLOG] - Task has been partially implemented but then scrapped and docked for a later date
    * [NOTPRIORITY] - Task is not important nor urgent and so can be ignored until other a later date

1.  **Infrastructure**
    * [DONE] Secure dedicated hosting and a professional Top-Level Domain (edcube.net)
    * [INPROGRESS] Migrate to Cloudflare Workers, R2, Hyperdrive, Supabase (Eventually secure paid versions of all).
    * [NOTPRIORITY] Eventually begin using Docker & Kubernetes once all else is done to show maturity of the site. 

2.  **Core Game & Site Features**
    * [DONE] Finalize dynamic page loading
    * [INPROGRESS] Populate the master database with categorized titles
    * [INPROGRESS] Ensure all game data attributes (ID, description, popularity, etc.) are standardized.
    * Add About this Game and Recommended Games sections
    * Build advanced search filters (Category, Popularity, Rating, Name).
    * [DONE] Integrate the Featured Games carousel on the home page.

3.  **Proxy**
    * [INPROGRESS] Deploy Ultraviolet or Scramjet proxy technology (Placeholder page exists).
    * Ensure anonymous browsing capabilities to bypass network restrictions.

4.  **Authentication & Accounts**
    * [DONE] Implement Sign-up/Login system using Supabase Auth.
    * [BACKLOG] Enable 2FA (Two-Factor Authentication) and Phone verification.
    * [DONE] Add OAuth with providers such as Google, GitHub, and Discord.
    * [INPROGRESS] Apply salted/hashed encryption and use appropriate RLS policies.
    * Save all game data to accounts so it is shared across any domain.
    * [BACKLOG] Implement Password Reset (Forgot Password), Password Change, and Email Change workflows (Currently removed to simplify).
    * [BACKLOG] Use Cloudflare Turnstile to verify humanity and prevent bots (Currently removed to simplify).

5.  **Legal**
    * [INPROGRESS] Establish formal DMCA Policy landing page and site-wide footer with with email/webhook triggers for DMCA notices for automated communication.
    * [DONE] Finalize Terms of Service (ToS) and Privacy Policy documentation.

6. **AI Chatbot**
    * Integrate Gemini-powered AI chatbot for limited user support and site navigation.
    * Add full AI chat page for homework help, questions, anything the user wants.
    * Integrate AI assisted site search and Cloudflare Workers AI & Vectorize

7. **Security**
    * Set up automated SQL database backups (Cron jobs).
    * Ensure Git history is completely free of secrets.
    * Perform full security audit throughout infrastructure including RLS policies.
    * [NOTPRIORITY] Implement GitGuardian CLI for secrets/API encrpytion as well as the dashboard for admin control. 
    * [NOTPRIORITY] Look into Cloudflare DDoS protection and WAF as well as Zero Trust features
    * [NOTPRIORITY] Built-in ad-blocker (for unintended in-game ads) and VPN service

8. **Performance & Optimization**
    * [INPROGRESS] Implement image compression and lazy loading.
    * [INPROGRESS] Configure Cloudflare Cache Rules and perform a full redundancy audit checks throughout infrastructure (Code, Cloudflare, Supabase).
    * Automated bundling/minification.
    * Perform full performance audit to ensure low latency and high speeds throughout the entire site.
    * Automatic settings changes based on device info to improve performance

9. **Feedback & Analytics**
    * Game Requests and Bug Reports with email/webhook triggers for automated communication.
    * Integration of 1-10 scale Survey System.
    * Automated statistical analysis (Median, Average, Typicals) via Sheets/Excel integration.
    * [INPROGRESS] In-depth SEO strategy and Google Search Console integration.
    * [NOTPRIORITY] Set up professional work email with Cloudflare Email Routing to recieve to personal mail and SMTP to send back (Eventually secure paid third-party email host). 
    * [DONE] Use Cloudflare Zaraz for Google Analytics

10.  **Site Community Features**
    * [BACKLOG] Deploy the Chat system with Supabase Presence and Broadcast (To be removed/archived due to maintenance overhead).
    * Support image sharing within chat.
    * Comments section and likes/dislikes on game pages
    * [NOTPRIORITY] Friends and social system similar to Discord with realtime statuses, direct messages, group chats, etc.

11. **Personalization & Customization**
    * [INPROGRESS] Deploy "Settings" tab for Dark/Light mode, themes, custom fonts, backgrounds, and cursors.
    * Different layouts like vertical sidebar instead of header
    * Animation control and manual settings to improve performance

12. **Admin Dashboard & Privileges**
    * Develop a management interface to disable features, manage users, and view analytics.
    * Integrate moderation tools and special access tags.
    * Built-in developer tools (e.g., Eruda) with encrypted access.

13. **Additional Community Features**
    * Discord bot to sync changelogs between Discord, Google Docs, and the Website.
    * Revamp Discord server with tighter website data synchronization.
    
14. **Gamification & Engagement**
    * User Tokens and Cosmetic Shop.
    * Daily streaks and Achievement Badges.

15. **Domain Proliferation & Mirrors**
    * Deploy multiple subdomains and mirrors with unified analytics.   

16. **Development Workflow & Testing**
    * [INPROGRESS] Transition to a GitHub Organization with formalized PR management.
    * [INPROGRESS] Integrate unit testing and UI validation audits.
    * Develop a centralized mechanism to trigger maintenance mode or emergency updates across all mirrors.
    * Implement automatic feature shutdown when Cloudflare/Supabase limits are approached.
    * Implement A/B testing framework for UI variations and retention metrics.
    * Perform horizontal vs vertical scaling tests.
    * Add a proper README.md file

17. **Exploration & Impact**
    * Final audits, polish, and major version release before maintenance era
    * Monetization with Google Ads, Google Floodlight, & Cloudflare Zaraz (HubSpot?)
    * Check out different possible infrastructure (Firebase, Azure, Mongo DB, Angular, Vue, Svelte)
    * Learn about architecture of everything in EdCube (meant for the dev)
    * Explore new ways to expand EdCube (nonprofit company?)
    * Create a reliable team who can maintain and build upon EdCube with minimal support

---

## 🐞 Known Issues & UI Polish
* **Header Hover Bug:** Resolve issue where the Home icon stays in hover state when on that page but others do not.
* **DMCA Autofill:** Fix logic where DMCA form fails to pull data from the active game page.
* **Consistency Audit:** Standardize titles and metadata across all library entries.
* **Redundancy Audit:** Remove duplicate CSS/JS assets and unused library hooks.

---

## 🏗️ Infrastructure Stack
* [DONE] **Frontend:** Cloudflare Workers (Next.js 16)
* [DONE] **Logic:** Cloudflare Workers (Edge Serverless)
* [INPROGRESS] **Storage:** Cloudflare R2 (Assets/Source) (Set up but files still need to be moved manually)
* [DONE] **Database:** Supabase / PostgreSQL (Relational)
* **Data Acceleration:** Cloudflare Hyperdrive
* [INPROGRESS] **Additional Infrastructure & Tools:** Supabase Broadcast, Supabase Presence, Supabase Auth, Cloudflare Turnstile, Cloudflare DNS, Cloudflare Email Service, Cloudflare DDos Protection, Cloudflare WAF, Cloudflare Zero Trust, Cloudflare Zaraz, Google Analytics, Google Ads, GitGuardian
