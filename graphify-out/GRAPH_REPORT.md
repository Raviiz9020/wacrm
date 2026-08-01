# Graph Report - .  (2026-08-01)

## Corpus Check
- 15 files · ~319,713 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2241 nodes · 5685 edges · 154 communities (89 shown, 65 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- flow-canvas.tsx
- contacts/page.tsx
- cn
- automation-builder.tsx
- toErrorResponse
- createClient
- auto-reply.ts
- button.tsx
- encoderWorker.min.js
- broadcasts/[id]/page.tsx
- types/index.ts
- flows/engine.ts
- template-manager.tsx
- flows/types.ts
- meta-api.ts
- customerAssetService.ts
- BookingDashboard.tsx
- members-tab.tsx
- WacrmClient
- decrypt
- supabaseAdmin
- requireApiKey
- use-theme.tsx
- contacts.ts
- createClient
- Conversation
- dependencies
- bar-chart.tsx
- components.json
- message-thread.tsx
- send-message.ts
- deliver.ts
- invitations/route.ts
- supabaseAdmin
- currency.ts
- mcp-server/package.json
- devDependencies
- contacts/route.ts
- message-bubble.tsx
- interactive.ts
- toApiErrorResponse
- webhooks/route.ts
- MessageTemplate
- throwMetaError
- queries.ts
- automations/new/page.tsx
- knowledge.ts
- anthropic.ts
- compilerOptions
- package.json
- activity-feed.tsx
- template-components.ts
- template-validators.ts
- dashboard/page.tsx
- pipeline-donut.tsx
- use-presence.ts
- compilerOptions
- wacrm README
- automations/engine.test.ts
- template-webhook.ts
- keywords
- send/route.ts
- template-send-builder.ts
- logs/page.tsx
- conversations-chart.tsx
- automations/meta-send.ts
- server.json
- scripts
- templates/[id]/route.ts
- ai-thread-banner.tsx
- SettingsPanelHead
- keywords
- submit/route.ts
- sync/route.ts
- runs/page.tsx
- pipeline-analytics.tsx
- template-header-handle.ts
- PortfolioMediaManager.tsx
- mcp-server/tsconfig.json
- response-time-chart.tsx
- scopes.ts
- devDependencies
- overrides
- include
- sidebar.tsx
- parse-contact-csv.ts
- scripts
- react
- agents/page.tsx
- Account Invitations Table
- layout/header.tsx
- class-variance-authority
- sendMediaMessage
- Flows Table
- glama.json
- next.config.ts
- lib
- login/page.tsx
- members.ts
- generate.test.ts
- account.test.ts
- template-status.ts
- webhook-signature.test.ts
- AI Knowledge Chunks Table
- (auth)/layout.tsx
- signup/page.tsx
- icon.tsx
- join/layout.tsx
- SecurityPanel
- middleware.ts
- middleware.test.ts
- Profiles Table (Beta Features)
- paths
- Next.js Agent Rules
- @base-ui/react
- tags table
- @dnd-kit/core
- eslint.config.mjs
- Community 118
- next-intl
- opus-recorder
- recharts
- sonner
- tw-animate-css
- @xyflow/react
- postcss.config.mjs
- app/page.tsx
- ForbiddenError
- UnauthorizedError
- Booking Module Schema
- Member Presence Table
- AI Configs Table
- Changelog
- Contributing Guide
- Code of Conduct
- Dependabot Config
- Bug Report Template
- Issue Config
- Pull Request Template
- Security Policy
- GitHub CI Workflow
- Query: toErrorResponse inferred relationships
- Query: requireRole and auth checks design
- Query: Automations engine architecture
- File SVG Icon
- Globe SVG Icon
- Inbox Doodle SVG Image
- Next.js SVG Icon
- Vercel SVG Icon
- Window SVG Icon
- SettingsRail
- request.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 180 edges
2. `types/index.ts` - 145 edges
3. `createClient()` - 77 edges
4. `useAuth()` - 60 edges
5. `toErrorResponse()` - 60 edges
6. `requireRole()` - 55 edges
7. `createClient()` - 52 edges
8. `contacts/page.tsx` - 50 edges
9. `Button()` - 45 edges
10. `supabase/client.ts` - 43 edges

## Surprising Connections (you probably didn't know these)
- `wacrm README` --references--> `Hostinger Deploy Screenshot`  [EXTRACTED]
  README.md → .github/assets/hostinger-deploy.png
- `Adding a New AI Provider` --references--> `Gemini Provider Adapter`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/providers/gemini.ts
- `Adding a New AI Provider` --references--> `Migration: Add Gemini Provider`  [EXTRACTED]
  docs/add-ai-provider.md → supabase/migrations/040_add_gemini_provider.sql
- `Adding a New AI Provider` --references--> `AiConfig Component`  [EXTRACTED]
  docs/add-ai-provider.md → src/components/settings/ai-config.tsx
- `Adding a New AI Provider` --references--> `AI_PROVIDER_DEFAULT_MODEL`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/defaults.ts

## Import Cycles
- 3-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 4-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-send-builder.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 4-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-components.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 5-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-send-builder.ts -> src/lib/whatsapp/template-validators.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 5-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-components.ts -> src/lib/whatsapp/template-validators.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`

## Hyperedges (group relationships)
- **AI Provider Integration Pattern** — src_lib_ai_types_aiprovider, src_lib_ai_defaults_ai_provider_default_model, src_lib_ai_providers_gemini, src_lib_ai_generate_generatereply, src_components_settings_ai_config [EXTRACTED]
- **Flow Builder Architecture** — src_lib_flows_engine, src_components_flows_forms_node_config_form, src_lib_flows_types [INFERRED]
- **Booking Module Implementation** — src_app_dashboard_bookings_page, src_modules_booking_ui_bookingdashboard, src_modules_booking_database_schema, supabase_migrations_038_booking_module_init [EXTRACTED 1.00]
- **AI Provider Extension (OpenRouter)** — src_components_settings_ai_config, supabase_migrations_037_ai_openrouter, supabase_migrations_039_fix_ai_usage_log_provider_check [EXTRACTED 0.90]
- **Authentication Flow** — src_app_auth_login_page, src_app_auth_signup_page, src_hooks_use_auth, src_lib_supabase_client [EXTRACTED 1.00]
- **Dashboard Core Features** — src_app_dashboard_inbox_page, src_app_dashboard_pipelines_page, src_app_dashboard_automations_page, src_app_dashboard_broadcasts_page, src_app_dashboard_flows_page, src_app_dashboard_agents_page [INFERRED 0.85]
- **Broadcast Wizard Flow** — src_components_broadcasts_step2_select_audience_step2selectaudience, src_components_broadcasts_step3_personalize_step3personalize, src_components_broadcasts_step4_schedule_send_step4schedulesend [EXTRACTED 0.95]
- **Flow Editor System** — src_components_flows_flow_editor_shell_floweditorshell, src_components_flows_flow_editor_state_floweditorprovider, src_components_flows_flow_builder_flowbuilder, src_components_flows_flow_canvas_flowcanvas [EXTRACTED 1.00]
- **Dashboard Widgets** — src_components_dashboard_activity_feed_activityfeed, src_components_dashboard_conversations_chart_conversationschart, src_components_dashboard_pipeline_donut_pipelinedonut, src_components_dashboard_response_time_chart_responsetimechart [INFERRED 0.85]
- **Pipeline Management** — src_components_pipelines_pipeline_board_pipelineboard, src_components_pipelines_deal_form_dealform, src_components_pipelines_pipeline_analytics_pipelineanalytics, src_components_pipelines_pipeline_settings_pipelinesettings [INFERRED 0.90]
- **Settings Redesign Components** — src_components_settings_settings_overview_settings_overview, src_components_settings_settings_rail_settings_rail, src_components_settings_settings_panel_head_settings_panel_head [INFERRED 0.80]
- **Authentication & Profile Management** — src_components_settings_profile_form_profile_form, src_components_settings_password_form_password_form, src_components_settings_sessions_card_sessions_card, src_hooks_use_auth_use_auth [EXTRACTED 0.90]
- **Multi-Tenant Account Sharing System** — supabase_migrations_017_account_sharing_accounts, supabase_migrations_017_account_sharing_account_invitations, supabase_migrations_017_account_sharing_is_account_member, supabase_migrations_018_account_member_rpcs_set_member_role, supabase_migrations_019_invitation_rpcs_redeem_invitation [EXTRACTED 1.00]
- **AI Reply Assistant & Knowledge Base** — supabase_migrations_029_ai_reply_ai_configs, supabase_migrations_030_ai_knowledge_ai_knowledge_documents, supabase_migrations_030_ai_knowledge_ai_knowledge_chunks, supabase_migrations_033_ai_reply_polish_ai_usage_log [EXTRACTED 1.00]
- **Conversational Flows Engine** — supabase_migrations_010_flows_flows, supabase_migrations_010_flows_flow_nodes, supabase_migrations_010_flows_flow_runs, supabase_migrations_010_flows_flow_run_events, supabase_migrations_016_flow_media_flow_media_bucket [EXTRACTED 1.00]

## Communities (154 total, 65 thin omitted)

### Community 0 - "flow-canvas.tsx"
Cohesion: 0.05
Nodes (76): activate/route.ts, POST(), flows/[id]/page.tsx, FlowBuilder(), NodeCard(), NodeConfigWithAdvanced(), ADD_NODE_TYPES, CanvasAddNodeButton() (+68 more)

### Community 1 - "contacts/page.tsx"
Cohesion: 0.05
Nodes (63): usage/route.ts, GET(), UsageRow, dashboard/page.tsx, DashboardPage(), deltaLabel(), RangeDays, ActivityFeed() (+55 more)

### Community 2 - "cn"
Cohesion: 0.05
Nodes (55): PreviewCell(), Skeleton(), SkeletonCard(), AddNodeButton(), NodeKeySelect(), IssueLine(), ConversationItem(), ConversationItemProps (+47 more)

### Community 3 - "automation-builder.tsx"
Cohesion: 0.09
Nodes (53): automations/page.tsx, TEMPLATE_ICON, TEMPLATE_ORDER, contacts/page.tsx, flows/page.tsx, describeTrigger(), FlowCard(), FlowRow (+45 more)

### Community 4 - "toErrorResponse"
Cohesion: 0.07
Nodes (54): POST(), POST(), POST(), ContactOutcome, ContactRow, findOrCreateContact(), findOrCreateConversation(), flagBroadcastReplyIfAny() (+46 more)

### Community 5 - "createClient"
Cohesion: 0.05
Nodes (52): edit/page.tsx, automations/new/page.tsx, expandFromSeeds(), NewAutomationPage(), SeedRow, uid(), ADDABLE_STEPS, AgentSelect() (+44 more)

### Community 6 - "auto-reply.ts"
Cohesion: 0.07
Nodes (47): RFC-4180, AutomationsPage(), broadcasts/[id]/page.tsx, BroadcastDetailPage(), FunnelStep, RECIPIENT_STATUSES, StatCardProps, broadcasts/page.tsx (+39 more)

### Community 7 - "button.tsx"
Cohesion: 0.11
Nodes (50): broadcast/route.ts, BroadcastResult, POST(), findOrCreateContact(), automations/meta-send.ts, engineSendInteractive(), engineSendTemplate(), engineSendText() (+42 more)

### Community 8 - "encoderWorker.min.js"
Cohesion: 0.07
Nodes (48): ForgotPasswordPage(), broadcasts/new/page.tsx, NewBroadcastPage(), steps, ContactsPage(), notifications/page.tsx, NotificationsPage(), TYPE_ICON (+40 more)

### Community 9 - "broadcasts/[id]/page.tsx"
Cohesion: 0.07
Nodes (39): ContactDetailView(), ContactDetailViewProps, collectVariableSlots(), renderBodyPreview(), TemplatePicker(), TemplateSendValues, DealCard(), DealCardProps (+31 more)

### Community 10 - "types/index.ts"
Cohesion: 0.06
Nodes (23): abort(), abortOnCannotGrowMemory(), addOnPostRun(), addOnPreRun(), addRunDependency(), assert(), callRuntimeCallbacks(), createWasm() (+15 more)

### Community 11 - "flows/engine.ts"
Cohesion: 0.10
Nodes (39): RFC-6585, api-keys/[id]/route.ts, DELETE(), invitations/[id]/route.ts, DELETE(), [userId]/route.ts, DELETE(), PATCH() (+31 more)

### Community 12 - "template-manager.tsx"
Cohesion: 0.05
Nodes (41): NewRecipient, [mediaId]/route.ts, GET(), SendInteractiveButtonsEngineArgs, SendInteractiveListEngineArgs, DeleteMessageTemplateArgs, downloadMedia(), DownloadMediaArgs (+33 more)

### Community 13 - "flows/types.ts"
Cohesion: 0.07
Nodes (41): flows/cron/route.ts, GET(), templates/route.ts, GET(), decideFallback(), FallbackAction, resolveFallbackPolicy(), POLICY_REPROMPT_2_HANDOFF (+33 more)

### Community 14 - "meta-api.ts"
Cohesion: 0.05
Nodes (38): DraftState, useUnreadNotifications(), templateStatusConfig, TemplateStatusDisplay, types/index.ts, Account, AccountInvitation, AssignConversationStepConfig (+30 more)

### Community 15 - "customerAssetService.ts"
Cohesion: 0.14
Nodes (21): src/client.ts, Paginated, WacrmApiError, WacrmClient, src/config.ts, Config, loadConfig(), truthy() (+13 more)

### Community 16 - "BookingDashboard.tsx"
Cohesion: 0.08
Nodes (32): SettingsPage(), RequireRole(), PRESENCE_DOT_CLASS, PresenceDot(), InviteMemberDialog(), EDITABLE_ROLES, fmtDate(), fmtExpiresIn() (+24 more)

### Community 17 - "members-tab.tsx"
Cohesion: 0.11
Nodes (27): templates/[id]/route.ts, DELETE(), EDITABLE_STATUSES, isDryRun(), PATCH(), submit/route.ts, buildUpsertRow(), POST() (+19 more)

### Community 18 - "WacrmClient"
Cohesion: 0.16
Nodes (21): Query: Multi-tenant architecture and RLS, forgot-password/page.tsx, AiUsageCard(), UsageResponse, WINDOWS, DocSummary, EditTarget, SettingsPanelHead() (+13 more)

### Community 19 - "decrypt"
Cohesion: 0.10
Nodes (25): ApiContact, ContactInput, RawTagJoin, dedupeByPhone(), ExistingContact, findExistingContact(), isExactMatch(), isUniqueViolation() (+17 more)

### Community 20 - "supabaseAdmin"
Cohesion: 0.10
Nodes (23): RFC-1918, blankButtonsPayload(), blankListPayload(), ButtonsEditor(), InteractiveBuilder(), InteractiveBuilderProps, ListEditor(), nextId() (+15 more)

### Community 21 - "requireApiKey"
Cohesion: 0.15
Nodes (29): api-keys/route.ts, GET(), POST(), IMPORTANT: the plaintext key is returned exactly ONCE, in the POST, GET(), members/route.ts, GET(), ProfileRow (+21 more)

### Community 22 - "use-theme.tsx"
Cohesion: 0.15
Nodes (30): duplicate/route.ts, POST(), automations/[id]/route.ts, DELETE(), GET(), PATCH(), requireUser(), automations/route.ts (+22 more)

### Community 23 - "contacts.ts"
Cohesion: 0.11
Nodes (22): me/route.ts, GET(), generateApiKey(), GeneratedApiKey, hashApiKey(), looksLikeApiKey(), timingSafeHexEqual(), ApiKeyRow (+14 more)

### Community 24 - "createClient"
Cohesion: 0.13
Nodes (25): app/layout.tsx, inter, metadata, viewport, ModeToggle(), AppearancePanel(), ModeCard(), ThemeCard() (+17 more)

### Community 25 - "Conversation"
Cohesion: 0.12
Nodes (23): automations/cron/route.ts, GET(), sleep(), appendResults(), AutomationContext, DispatchInput, evaluateCondition(), ExecuteArgs (+15 more)

### Community 26 - "dependencies"
Cohesion: 0.15
Nodes (25): TemplateFormData, makeDb(), buildBodyComponent(), buildButtonComponent(), buildHeaderComponent(), buildSendComponents(), buttonNeedsSendParam(), MetaSendComponent (+17 more)

### Community 27 - "bar-chart.tsx"
Cohesion: 0.23
Nodes (27): NodeConfigForm, flows/engine.ts, AdminClient, advanceCurrentNodeKey(), advanceFromNodeKey(), dispatchInboundToFlows(), endRun(), evaluateConditionNode() (+19 more)

### Community 28 - "components.json"
Cohesion: 0.27
Nodes (24): broadcasts/[id]/route.ts, GET(), broadcasts/route.ts, POST(), contacts/[id]/route.ts, GET(), PATCH(), contacts/route.ts (+16 more)

### Community 29 - "message-thread.tsx"
Cohesion: 0.12
Nodes (21): sync/route.ts, extractSampleValues(), MetaButton, MetaTemplate, MetaTemplateComponent, normalizeCategory(), normalizeQualityScore(), parseButtons() (+13 more)

### Community 30 - "send-message.ts"
Cohesion: 0.08
Nodes (25): clsx, @dagrejs/dagre, date-fns, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, next, dependencies (+17 more)

### Community 31 - "deliver.ts"
Cohesion: 0.14
Nodes (20): booking/send-slots/route.ts, booking/slots/route.ts, api/send-slots/route.ts, POST(), api/slots/route.ts, GET(), Appointment, Provider (+12 more)

### Community 32 - "invitations/route.ts"
Cohesion: 0.16
Nodes (18): config/route.ts, DELETE(), GET(), POST(), resolveAccountId(), supabaseAdmin(), verify-registration/route.ts, GET() (+10 more)

### Community 33 - "supabaseAdmin"
Cohesion: 0.11
Nodes (21): BarChartEventProps, BarChartProps, BaseEventProps, ChartTooltip(), ChartTooltipProps, deepEqual(), HasScrollProps, Legend (+13 more)

### Community 34 - "currency.ts"
Cohesion: 0.13
Nodes (19): inbox/page.tsx, ContactSidebar(), ComposerMediaKind, formatDuration(), MediaDraft, MessageComposer(), MessageComposerProps, PICKER_ACCEPT (+11 more)

### Community 35 - "mcp-server/package.json"
Cohesion: 0.23
Nodes (17): EmbeddingResponse, embedTexts(), toVectorLiteral(), retrieveKnowledge(), AnthropicResponse, generateAnthropic(), normalizeForAnthropic(), generateOpenAi() (+9 more)

### Community 36 - "devDependencies"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 37 - "contacts/route.ts"
Cohesion: 0.23
Nodes (19): [id]/messages/route.ts, GET(), conversations/route.ts, GET(), v1/conversations.ts, ApiConversation, ApiMessage, serializeConversation() (+11 more)

### Community 38 - "message-bubble.tsx"
Cohesion: 0.21
Nodes (19): invitations/route.ts, getBaseUrl(), isHostAllowed(), parseAllowedHosts(), POST(), IMPORTANT: the plaintext token is returned exactly ONCE — in, peek/route.ts, GET() (+11 more)

### Community 39 - "interactive.ts"
Cohesion: 0.13
Nodes (13): Adding a New AI Provider, POST /api/ai/config, POST /api/ai/test, AiConfig Component, AI_PROVIDER_DEFAULT_MODEL, generateReply, Gemini Provider Adapter, AiProvider Type (+5 more)

### Community 40 - "toApiErrorResponse"
Cohesion: 0.10
Nodes (20): mcp-server/package.json, author, bin, wacrm-mcp, description, engines, node, files (+12 more)

### Community 41 - "webhooks/route.ts"
Cohesion: 0.20
Nodes (19): flows/[id]/route.ts, DELETE(), GET(), PUT(), PutBody, requireOwnership(), runs/route.ts, GET() (+11 more)

### Community 42 - "MessageTemplate"
Cohesion: 0.13
Nodes (17): ContactWithTags, contactFields, isMediaHeaderType(), isValidHttpUrl(), MEDIA_HEADER_TYPES, MediaHeaderType, SAMPLE_CONTACT, Step3Personalize() (+9 more)

### Community 43 - "throwMetaError"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+11 more)

### Community 44 - "queries.ts"
Cohesion: 0.16
Nodes (10): MessageBubble(), MessageBubbleProps, groupReactions(), MessageReactions(), MessageReactionsProps, ReactionGroup, ReplyQuote(), ReplyQuoteProps (+2 more)

### Community 45 - "automations/new/page.tsx"
Cohesion: 0.17
Nodes (16): conversations/[id]/route.ts, GET(), ConversationList(), RealtimeEvent, useRealtime(), UseRealtimeOptions, inbox/conversations.ts, ContactFilters (+8 more)

### Community 46 - "knowledge.ts"
Cohesion: 0.27
Nodes (14): webhooks/[id]/route.ts, PATCH(), webhooks/route.ts, GET(), POST(), ApiWebhookEndpoint, generateWebhookSecret(), normalizeWebhookUrl() (+6 more)

### Community 47 - "anthropic.ts"
Cohesion: 0.14
Nodes (15): DashboardShell(), DashboardShellInner(), (dashboard)/layout.tsx, metadata, layout/header.tsx, getPageTitleKey(), Header(), HeaderProps (+7 more)

### Community 48 - "compilerOptions"
Cohesion: 0.16
Nodes (15): QuickReplyPicker(), QuickReplyPickerProps, fail(), InteractiveButton, InteractiveButtonsPayload, InteractiveListPayload, InteractiveListRow, InteractiveListSection (+7 more)

### Community 49 - "package.json"
Cohesion: 0.16
Nodes (13): CATEGORIES, categoryColors, COMMON_LANGUAGE_CODES, emptyForm, HEADER_FORMATS, HeaderFormat, Badge(), badgeVariants (+5 more)

### Community 50 - "activity-feed.tsx"
Cohesion: 0.12
Nodes (14): Step1Props, Step3Props, Step4Props, TemplatePickerProps, AudienceConfig, BroadcastApiResult, BroadcastPayload, CustomFieldFilter (+6 more)

### Community 51 - "template-components.ts"
Cohesion: 0.13
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir (+7 more)

### Community 52 - "template-validators.ts"
Cohesion: 0.13
Nodes (14): author, bugs, url, description, engines, node, homepage, license (+6 more)

### Community 53 - "dashboard/page.tsx"
Cohesion: 0.29
Nodes (11): ICON_MAP, IndustryConfig(), IndustryConfigProps, applyIndustryPreset(), getActiveAssetType(), getIndustryPresets(), getSupabaseClient(), INDUSTRY_PRESETS (+3 more)

### Community 54 - "pipeline-donut.tsx"
Cohesion: 0.14
Nodes (14): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+6 more)

### Community 55 - "use-presence.ts"
Cohesion: 0.18
Nodes (13): MCP Documentation, Public REST API Documentation, Hostinger Deploy Screenshot, MCP Server README, wacrm README, AI Reply Assistant, No-code Automations, Broadcasts & Templates (+5 more)

### Community 56 - "compilerOptions"
Cohesion: 0.23
Nodes (11): send/route.ts, findOrCreateConversation(), POST(), SendSupabase, CONTACT, conversationInserts, messageInserts, postContactTemplate() (+3 more)

### Community 57 - "wacrm README"
Cohesion: 0.28
Nodes (9): PresenceMap, UsePresenceResult, derivePresence(), formatLastSeen(), presenceLabel(), PresenceRow, PresenceStatus, StoredPresence (+1 more)

### Community 58 - "automations/engine.test.ts"
Cohesion: 0.17
Nodes (12): dependencies, @modelcontextprotocol/sdk, zod, crm, keywords, @modelcontextprotocol/sdk, whatsapp, ai (+4 more)

### Community 59 - "template-webhook.ts"
Cohesion: 0.21
Nodes (11): logs/page.tsx, AutomationLogsPage(), StatusBadge(), StepRow(), AutomationCard(), formatRelative(), TRIGGER_META, triggerMeta (+3 more)

### Community 60 - "keywords"
Cohesion: 0.20
Nodes (9): description, name, packages, repository, source, subfolder, url, $schema (+1 more)

### Community 61 - "send/route.ts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, start, test (+2 more)

### Community 62 - "template-send-builder.ts"
Cohesion: 0.24
Nodes (7): AiAccountStatus, AiThreadBanner(), AiThreadBannerProps, fetchAiAccountStatus(), parseBriefing(), ParsedBriefing, statusCache

### Community 63 - "logs/page.tsx"
Cohesion: 0.22
Nodes (9): message_templates table, profiles table, MembersTab, ProfileForm, QuickRepliesManager, SettingsOverview, SettingsPanelHead, TemplateManager (+1 more)

### Community 64 - "conversations-chart.tsx"
Cohesion: 0.22
Nodes (9): crm, keywords, automation, broadcast, nextjs, self-hosted, supabase, template (+1 more)

### Community 65 - "automations/meta-send.ts"
Cohesion: 0.25
Nodes (8): runs/page.tsx, EVENT_COLOR, EventLine(), EventRow, RunCard(), RunRow, STATUS_META, summarizePayload()

### Community 66 - "server.json"
Cohesion: 0.50
Nodes (7): addPortfolioMedia(), deletePortfolioMedia(), getSupabaseClient(), listPortfolioMedia(), PortfolioMediaManager(), PortfolioMediaManagerProps, PortfolioMedia

### Community 67 - "scripts"
Cohesion: 0.25
Nodes (7): mcp-server/tsconfig.json, exclude, include, dist, src/**/*, exclude, node_modules

### Community 68 - "templates/[id]/route.ts"
Cohesion: 0.46
Nodes (6): API_SCOPES, ApiScope, hasScope(), isApiScope(), normalizeScopes(), SCOPE_DESCRIPTIONS

### Community 69 - "ai-thread-banner.tsx"
Cohesion: 0.29
Nodes (7): devDependencies, @types/node, typescript, @types/node, typescript, @types/node, typescript

### Community 70 - "SettingsPanelHead"
Cohesion: 0.29
Nodes (7): overrides, @babel/core, fast-uri, hono, ip-address, js-yaml, postcss

### Community 71 - "keywords"
Cohesion: 0.29
Nodes (7): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx, include

### Community 72 - "submit/route.ts"
Cohesion: 0.48
Nodes (5): parseContactCsv(), ParseContactCsvResult, parseCsvLine(), ParsedContactRow, parseTagCell()

### Community 73 - "sync/route.ts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, prepublishOnly, start, typecheck

### Community 74 - "runs/page.tsx"
Cohesion: 0.40
Nodes (5): react, react, ChartLegend(), ScrollButton(), useOnWindowResize()

### Community 75 - "pipeline-analytics.tsx"
Cohesion: 0.40
Nodes (4): agents/page.tsx, Tab, AiPlayground(), Turn

### Community 76 - "template-header-handle.ts"
Cohesion: 0.33
Nodes (6): Account Invitations Table, Accounts Table, remove_account_member, transfer_account_ownership, peek_invitation, redeem_invitation

### Community 78 - "mcp-server/tsconfig.json"
Cohesion: 0.50
Nodes (3): generateStructuredHandoffBriefing(), StructuredHandoffBriefing, h

### Community 79 - "response-time-chart.tsx"
Cohesion: 0.40
Nodes (5): Flow Nodes Table, Flow Run Events Table, Flow Runs Table, Flows Table, increment_flow_execution_count

### Community 80 - "scopes.ts"
Cohesion: 0.50
Nodes (3): maintainers, $schema, ArnasDon

### Community 81 - "devDependencies"
Cohesion: 0.50
Nodes (3): nextConfig, SECURITY_HEADERS, withNextIntl

### Community 82 - "overrides"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 83 - "include"
Cohesion: 0.83
Nodes (4): transfer-ownership/route.ts, looksLikeUuid(), POST(), rpcErrorToResponse()

### Community 89 - "Account Invitations Table"
Cohesion: 0.50
Nodes (4): AI Knowledge Chunks Table, AI Knowledge Documents Table, match_ai_knowledge_fts, match_ai_knowledge_semantic

### Community 94 - "glama.json"
Cohesion: 0.67
Nodes (3): PasswordForm, SecurityPanel, SessionsCard

### Community 98 - "members.ts"
Cohesion: 0.67
Nodes (3): Profiles Table (Beta Features), is_account_member, set_member_role

### Community 99 - "generate.test.ts"
Cohesion: 0.67
Nodes (3): paths, ./src/*, @/*

## Knowledge Gaps
- **599 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+594 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **65 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `types/index.ts` connect `meta-api.ts` to `cn`, `automation-builder.tsx`, `toErrorResponse`, `createClient`, `auto-reply.ts`, `button.tsx`, `encoderWorker.min.js`, `broadcasts/[id]/page.tsx`, `template-manager.tsx`, `members-tab.tsx`, `WacrmClient`, `requireApiKey`, `use-theme.tsx`, `dependencies`, `message-thread.tsx`, `currency.ts`, `contacts/route.ts`, `MessageTemplate`, `queries.ts`, `automations/new/page.tsx`, `compilerOptions`, `package.json`, `activity-feed.tsx`, `dashboard/page.tsx`, `template-webhook.ts`, `server.json`, `parse-contact-csv.ts`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `flow-canvas.tsx`, `automations/meta-send.ts`, `contacts/page.tsx`, `automation-builder.tsx`, `supabaseAdmin`, `auto-reply.ts`, `encoderWorker.min.js`, `broadcasts/[id]/page.tsx`, `MessageTemplate`, `queries.ts`, `automations/new/page.tsx`, `BookingDashboard.tsx`, `package.json`, `WacrmClient`, `createClient`, `template-webhook.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `dependencies` connect `send-message.ts` to `template-status.ts`, `webhook-signature.test.ts`, `(auth)/layout.tsx`, `icon.tsx`, `join/layout.tsx`, `runs/page.tsx`, `SecurityPanel`, `middleware.ts`, `middleware.test.ts`, `Profiles Table (Beta Features)`, `template-validators.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _599 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `flow-canvas.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05303030303030303 - nodes in this community are weakly interconnected._
- **Should `contacts/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05387861084063616 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.053554040895813046 - nodes in this community are weakly interconnected._