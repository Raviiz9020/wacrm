# Graph Report - .  (2026-07-28)

## Corpus Check
- 31 files · ~311,199 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2215 nodes · 5660 edges · 163 communities (102 shown, 61 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.68)
- Token cost: 26,491 input · 1,131 output

## Community Hubs (Navigation)
- page.tsx
- page.tsx
- route.ts
- page.tsx
- page.tsx
- DraftState
- encoderWorker.min.js
- ForgotPasswordPage()
- page.tsx
- NewRecipient
- page.tsx
- RFC-6585
- route.ts
- package.json
- ai-usage.tsx
- client.ts
- Adding a New AI Provider
- route.ts
- page.tsx
- chunk.ts
- dom
- layout.tsx
- route.ts
- route.ts
- route.ts
- GET()
- class-variance-authority
- route.ts
- bar-chart.tsx
- deal-card.tsx
- contacts.ts
- eslint
- activity-feed.tsx
- components.json
- RFC-4180
- route.ts
- RFC-1918
- tsconfig.json
- route.ts
- route.ts
- message-bubble.tsx
- message-composer.tsx
- QuickReplyPicker()
- fmtDate()
- SendInteractiveArgs
- keys.ts
- template-status-normalize.ts
- route.ts
- page.tsx
- AutomationsPage()
- AiUsageCard()
- Query: Multi-tenant architecture and RLS
- route.ts
- route.ts
- template-validators.ts
- page.tsx
- MCP Documentation
- package.json
- route.ts
- page.tsx
- page.tsx
- makeDb()
- template-components.ts
- route.ts
- conversations-chart.tsx
- use-broadcast-sending.ts
- sleep()
- matrixPricingService.ts
- server.json
- crm
- scripts
- route.ts
- route.ts
- ai-thread-banner.tsx
- customerAssetService.ts
- message_templates table
- page.tsx
- page.tsx
- portfolioService.ts
- scopes.ts
- overrides
- contact-sidebar.tsx
- sidebar.tsx
- parse-contact-csv.ts
- conversations.ts
- opus-recorder.d.ts
- react
- page.tsx
- Account Invitations Table
- route.ts
- header.tsx
- Flow Nodes Table
- glama.json
- next.config.ts
- page.tsx
- members.ts
- handoff.ts
- account.test.ts
- BroadcastError
- webhook-signature.ts
- AI Knowledge Chunks Table
- repository
- layout.tsx
- icon.tsx
- layout.tsx
- PasswordForm
- middleware.ts
- middleware.test.ts
- Profiles Table (Beta Features)
- Next.js Agent Rules
- @base-ui/react
- tags table
- @dnd-kit/core
- eslint.config.mjs
- next
- next-intl
- opus-recorder
- recharts
- tailwind-merge
- tw-animate-css
- @xyflow/react
- postcss.config.mjs
- Booking Module Schema
- Member Presence Table
- AI Configs Table
- Changelog
- Contributing Guide
- Code of Conduct
- Dependabot Config
- Pull Request Template
- Security Policy
- Bug Report Template
- Issue Config
- Feature Request Template
- File SVG Icon
- Globe SVG Icon
- Inbox Doodle SVG Image
- Next.js SVG Icon
- Vercel SVG Icon
- Window SVG Icon
- Query: toErrorResponse inferred relationships
- Query: requireRole and auth checks design
- Query: Automations engine architecture
- SettingsRail
- Initial Schema Migration
- WhatsApp Config Table
- Message Templates Table
- Flow Media Storage Bucket
- merge_duplicate_contacts
- Chat Media Storage Bucket
- API Keys Table
- Notifications Table
- Webhook Endpoints Table
- claim_ai_reply_slot
- Quick Replies Table
- merge_duplicate_conversations
- Migration: AI OpenRouter
- Migration: Fix AI Usage Log Provider Check
- GitHub CI Workflow

## God Nodes (most connected - your core abstractions)
1. `cn()` - 179 edges
2. `createClient()` - 74 edges
3. `toErrorResponse()` - 64 edges
4. `useAuth()` - 59 edges
5. `requireRole()` - 59 edges
6. `createClient()` - 53 edges
7. `Button()` - 43 edges
8. `checkRateLimit()` - 42 edges
9. `requireApiKey()` - 39 edges
10. `rateLimitResponse()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Adding a New AI Provider` --references--> `AI_PROVIDER_DEFAULT_MODEL`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/defaults.ts
- `Adding a New AI Provider` --references--> `Gemini Provider Adapter`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/providers/gemini.ts
- `Adding a New AI Provider` --references--> `Migration: Add Gemini Provider`  [EXTRACTED]
  docs/add-ai-provider.md → supabase/migrations/040_add_gemini_provider.sql
- `Adding a New AI Provider` --references--> `AiConfig Component`  [EXTRACTED]
  docs/add-ai-provider.md → src/components/settings/ai-config.tsx
- `Adding a New AI Provider` --references--> `generateReply`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/generate.ts

## Import Cycles
- None detected.

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

## Communities (163 total, 61 thin omitted)

### Community 0 - "page.tsx"
Cohesion: 0.05
Nodes (74): AddNodeButton(), FlowBuilder(), NodeCard(), NodeConfigWithAdvanced(), ADD_NODE_TYPES, CanvasAddNodeButton(), FlowCanvas(), FlowCanvasInner() (+66 more)

### Community 1 - "page.tsx"
Cohesion: 0.06
Nodes (52): percent(), RateCell(), ContactDetailViewProps, PreviewCell(), MessageActions(), MessageActionsProps, QUICK_EMOJIS, TemplateSendValues (+44 more)

### Community 2 - "route.ts"
Cohesion: 0.07
Nodes (56): ContactOutcome, ContactRow, findOrCreateContact(), findOrCreateConversation(), flagBroadcastReplyIfAny(), GET(), handleReaction(), handleStatusUpdate() (+48 more)

### Community 3 - "page.tsx"
Cohesion: 0.05
Nodes (43): ADDABLE_STEPS, AgentSelect(), ApiStep, asInteractive(), AutomationBuilder(), AutomationResources, blankConfig(), BuilderInitial (+35 more)

### Community 4 - "page.tsx"
Cohesion: 0.11
Nodes (32): FAIL_COPY, PeekFail, PeekOk, PeekResult, ROLE_LABEL, AudienceConfig, CustomFieldsManagerProps, ImportModalProps (+24 more)

### Community 5 - "DraftState"
Cohesion: 0.06
Nodes (50): DraftState, useUnreadNotifications(), appendResults(), evaluateCondition(), ExecuteArgs, executeStepsFrom(), finalizeLog(), interpolate() (+42 more)

### Community 6 - "encoderWorker.min.js"
Cohesion: 0.06
Nodes (23): abort(), abortOnCannotGrowMemory(), addOnPostRun(), addOnPreRun(), addRunDependency(), assert(), callRuntimeCallbacks(), createWasm() (+15 more)

### Community 7 - "ForgotPasswordPage()"
Cohesion: 0.08
Nodes (40): ForgotPasswordPage(), DashboardShell(), DashboardShellInner(), metadata, NotificationsPage(), TYPE_ICON, PipelinesPage(), SettingsPage() (+32 more)

### Community 8 - "page.tsx"
Cohesion: 0.11
Nodes (33): RequireRole(), RequireRoleProps, ApiKey, ApiKeysSettings(), fmtDate(), keyStatus(), EDITABLE_ROLES, Invitation (+25 more)

### Community 9 - "NewRecipient"
Cohesion: 0.05
Nodes (43): NewRecipient, GET(), SendInteractiveButtonsEngineArgs, SendInteractiveListEngineArgs, DeleteMessageTemplateArgs, downloadMedia(), DownloadMediaArgs, EditMessageTemplateArgs (+35 more)

### Community 10 - "page.tsx"
Cohesion: 0.08
Nodes (35): AutomationLogsPage(), StatusBadge(), StepRow(), AutomationCard(), TEMPLATE_ICON, TEMPLATE_ORDER, ContactsPage(), ContactWithTags (+27 more)

### Community 11 - "RFC-6585"
Cohesion: 0.14
Nodes (32): RFC-6585, DELETE(), POST(), IMPORTANT: the plaintext key is returned exactly ONCE, in the POST, DELETE(), DELETE(), PATCH(), rpcErrorToResponse() (+24 more)

### Community 12 - "route.ts"
Cohesion: 0.07
Nodes (37): GET(), GET(), decideFallback(), FallbackAction, resolveFallbackPolicy(), POLICY_REPROMPT_2_HANDOFF, FAQ_BOT, FlowTemplate (+29 more)

### Community 13 - "package.json"
Cohesion: 0.05
Nodes (42): author, bin, wacrm-mcp, dependencies, @modelcontextprotocol/sdk, zod, description, devDependencies (+34 more)

### Community 14 - "ai-usage.tsx"
Cohesion: 0.08
Nodes (27): UsageResponse, WINDOWS, NodeKeySelect(), DocSummary, EditTarget, CATEGORIES, categoryColors, COMMON_LANGUAGE_CODES (+19 more)

### Community 15 - "client.ts"
Cohesion: 0.14
Nodes (16): Paginated, WacrmApiError, WacrmClient, Config, loadConfig(), truthy(), main(), registerBroadcastTools() (+8 more)

### Community 16 - "Adding a New AI Provider"
Cohesion: 0.09
Nodes (20): Adding a New AI Provider, POST /api/ai/config, POST(), POST(), POST /api/ai/test, AiConfig Component, supabaseAdmin(), loadAiConfig() (+12 more)

### Community 17 - "route.ts"
Cohesion: 0.18
Nodes (30): BroadcastResult, POST(), findOrCreateContact(), engineSendInteractive(), SendInput, SendTemplateArgs, SendTextArgs, sendViaMeta() (+22 more)

### Community 18 - "page.tsx"
Cohesion: 0.08
Nodes (29): NewBroadcastPage(), steps, categoryColors, Step1ChooseTemplate(), Step1Props, AudienceConfig, AudienceType, CustomFieldFilter (+21 more)

### Community 19 - "chunk.ts"
Cohesion: 0.15
Nodes (20): chunkText(), EmbeddingResponse, embedTexts(), toVectorLiteral(), MatchRow, retrieveKnowledge(), FakeState, h (+12 more)

### Community 20 - "dom"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+22 more)

### Community 21 - "layout.tsx"
Cohesion: 0.13
Nodes (24): inter, metadata, viewport, ModeToggle(), AppearancePanel(), ModeCard(), ThemeCard(), noopSubscribe() (+16 more)

### Community 22 - "route.ts"
Cohesion: 0.17
Nodes (23): DELETE(), GET(), PATCH(), requireUser(), GET(), POST(), supabaseAdmin(), BuilderStepInput (+15 more)

### Community 23 - "route.ts"
Cohesion: 0.19
Nodes (21): GET(), POST(), GET(), GET(), POST(), DELETE(), findActiveKeyByHash(), getAccountName() (+13 more)

### Community 24 - "route.ts"
Cohesion: 0.15
Nodes (18): POST(), POST(), DELETE(), GET(), PUT(), PutBody, requireOwnership(), GET() (+10 more)

### Community 25 - "GET()"
Cohesion: 0.14
Nodes (19): GET(), GET(), ProfileRow, GET(), GET(), GET(), POST(), DELETE() (+11 more)

### Community 26 - "class-variance-authority"
Cohesion: 0.08
Nodes (25): class-variance-authority, clsx, @dagrejs/dagre, date-fns, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, dependencies (+17 more)

### Community 27 - "route.ts"
Cohesion: 0.21
Nodes (17): GET(), sanitizeSearch(), GET(), GET(), serializeContact(), ApiConversation, ApiMessage, serializeConversation() (+9 more)

### Community 28 - "bar-chart.tsx"
Cohesion: 0.11
Nodes (22): BarChart, BarChartEventProps, BarChartProps, BaseEventProps, ChartTooltip(), ChartTooltipProps, deepEqual(), HasScrollProps (+14 more)

### Community 29 - "deal-card.tsx"
Cohesion: 0.17
Nodes (18): DealCard(), DealCardProps, formatDate(), initials(), DealFormProps, computeStageProbability(), PipelineAnalytics(), PipelineAnalyticsProps (+10 more)

### Community 30 - "contacts.ts"
Cohesion: 0.16
Nodes (18): ApiContact, ContactInput, RawTagJoin, dedupeByPhone(), ExistingContact, findExistingContact(), isExactMatch(), isUniqueViolation() (+10 more)

### Community 31 - "eslint"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+15 more)

### Community 32 - "activity-feed.tsx"
Cohesion: 0.13
Nodes (19): ActivityFeed(), ActivityFeedProps, KIND_THEME, KindTheme, PAGE_SIZES, PageSize, relativeTime(), fmt() (+11 more)

### Community 33 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 34 - "RFC-4180"
Cohesion: 0.13
Nodes (15): RFC-4180, BroadcastDetailPage(), FunnelStep, RECIPIENT_STATUSES, StatCardProps, BroadcastsPage(), broadcastStatusConfig, getBroadcastStatus() (+7 more)

### Community 35 - "route.ts"
Cohesion: 0.20
Nodes (17): GET(), getBaseUrl(), isHostAllowed(), parseAllowedHosts(), POST(), IMPORTANT: the plaintext token is returned exactly ONCE — in, GET(), getClientIp() (+9 more)

### Community 36 - "RFC-1918"
Cohesion: 0.16
Nodes (14): RFC-1918, deliverOne(), dispatchWebhookEvent(), EndpointRow, recordFailure(), Calls, makeDb(), Row (+6 more)

### Community 37 - "tsconfig.json"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir (+12 more)

### Community 38 - "route.ts"
Cohesion: 0.19
Nodes (13): DELETE(), GET(), POST(), resolveAccountId(), supabaseAdmin(), GET(), encrypt(), isLegacyFormat() (+5 more)

### Community 39 - "route.ts"
Cohesion: 0.26
Nodes (14): GET(), PATCH(), GET(), POST(), fail(), ApiWebhookEndpoint, generateWebhookSecret(), normalizeWebhookUrl() (+6 more)

### Community 40 - "message-bubble.tsx"
Cohesion: 0.16
Nodes (10): MessageBubble(), MessageBubbleProps, groupReactions(), MessageReactions(), MessageReactionsProps, ReactionGroup, ReplyQuote(), ReplyQuoteProps (+2 more)

### Community 41 - "message-composer.tsx"
Cohesion: 0.16
Nodes (15): ComposerMediaKind, formatDuration(), MediaDraft, MessageComposer(), MessageComposerProps, PICKER_ACCEPT, ReplyDraft, SendMediaPayload (+7 more)

### Community 42 - "QuickReplyPicker()"
Cohesion: 0.17
Nodes (16): QuickReplyPicker(), emptyDraft(), QuickRepliesManager(), fail(), InteractiveButton, InteractiveButtonsPayload, InteractiveListPayload, InteractiveListRow (+8 more)

### Community 43 - "fmtDate()"
Cohesion: 0.20
Nodes (14): fmtDate(), fmtExpiresIn(), MembersTab(), PresenceMap, usePresence(), UsePresenceResult, derivePresence(), formatLastSeen() (+6 more)

### Community 44 - "SendInteractiveArgs"
Cohesion: 0.15
Nodes (14): SendInteractiveArgs, SendMediaEngineArgs, InteractiveMessagePayload, MediaKind, ContactRow, from(), Script, MEDIA_KINDS (+6 more)

### Community 45 - "keys.ts"
Cohesion: 0.18
Nodes (10): generateApiKey(), GeneratedApiKey, hashApiKey(), looksLikeApiKey(), timingSafeHexEqual(), ApiKeyRow, ApiError, expectApiError() (+2 more)

### Community 46 - "template-status-normalize.ts"
Cohesion: 0.18
Nodes (12): ALLOWED, normalizeStatus(), handleComponentsUpdate(), handleQualityUpdate(), handleStatusUpdate(), handleTemplateWebhookChange(), isTemplateWebhookField(), TEMPLATE_WEBHOOK_FIELDS (+4 more)

### Community 47 - "route.ts"
Cohesion: 0.36
Nodes (12): GET(), UsageRow, daysAgoStart(), DOW_SHORT_MON_FIRST, lastNDayKeys(), localDayKey(), mondayIndex(), startOfLocalDay() (+4 more)

### Community 48 - "page.tsx"
Cohesion: 0.22
Nodes (14): expandFromSeeds(), NewAutomationPage(), SeedRow, uid(), BuilderStep, DispatchInput, AUTOMATION_TEMPLATES, AutomationTemplateDefinition (+6 more)

### Community 49 - "AutomationsPage()"
Cohesion: 0.33
Nodes (13): AutomationsPage(), FlowsPage(), CanAction, useCan(), ACCOUNT_ROLES, canDeleteAccount(), canEditSettings(), canManageMembers() (+5 more)

### Community 50 - "AiUsageCard()"
Cohesion: 0.21
Nodes (11): AiUsageCard(), EmptyState(), arcPath(), Donut(), PipelineDonut(), PipelineDonutProps, CURRENCIES, CurrencyOption (+3 more)

### Community 51 - "Query: Multi-tenant architecture and RLS"
Cohesion: 0.21
Nodes (12): Query: Multi-tenant architecture and RLS, ConnectionStatus, ResetReason, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Alert() (+4 more)

### Community 52 - "route.ts"
Cohesion: 0.27
Nodes (9): supabaseAdmin(), POST(), GET(), formatDateFriendly(), formatTime12Hour(), getAvailableSlots(), minutesToTime(), TimeSlot (+1 more)

### Community 53 - "route.ts"
Cohesion: 0.24
Nodes (9): buildUpsertRow(), POST(), upsertTemplateRow(), calls, submitMessageTemplate(), uploadResumableMedia(), ALLOWED_IMAGE_TYPES, ensureImageHeaderHandle() (+1 more)

### Community 54 - "template-validators.ts"
Cohesion: 0.33
Nodes (13): assertContiguous(), countButtonsByType(), extractVariableIndices(), HeaderValidationResult, TEMPLATE_LIMITS, baseValid, validateBody(), validateButtons() (+5 more)

### Community 55 - "page.tsx"
Cohesion: 0.20
Nodes (11): DashboardPage(), deltaLabel(), RangeDays, DeltaRow(), MetricCard(), MetricCardProps, Action, ACTIONS (+3 more)

### Community 56 - "MCP Documentation"
Cohesion: 0.18
Nodes (13): MCP Documentation, Public REST API Documentation, Hostinger Deploy Screenshot, MCP Server README, wacrm README, AI Reply Assistant, No-code Automations, Broadcasts & Templates (+5 more)

### Community 57 - "package.json"
Cohesion: 0.17
Nodes (11): author, bugs, url, description, engines, node, homepage, license (+3 more)

### Community 58 - "route.ts"
Cohesion: 0.24
Nodes (9): findOrCreateConversation(), POST(), SendSupabase, CONTACT, conversationInserts, messageInserts, postContactTemplate(), { sendTemplateMessage } (+1 more)

### Community 59 - "page.tsx"
Cohesion: 0.23
Nodes (9): describeTrigger(), FlowCard(), FlowRow, STATUS_COLORS, STATUS_LABELS(), TEMPLATE_ICONS, TemplateSummary, Badge() (+1 more)

### Community 60 - "page.tsx"
Cohesion: 0.24
Nodes (9): ContactSidebar(), ConversationListProps, MessageThreadProps, RealtimeEvent, useRealtime(), UseRealtimeOptions, Conversation, ConversationStatus (+1 more)

### Community 61 - "makeDb()"
Cohesion: 0.24
Nodes (10): makeDb(), buildBodyComponent(), buildButtonComponent(), buildHeaderComponent(), buildSendComponents(), buttonNeedsSendParam(), MetaSendComponent, MetaSendParameter (+2 more)

### Community 62 - "template-components.ts"
Cohesion: 0.26
Nodes (10): buildBodyComponent(), buildButtonPayload(), buildButtonsComponent(), buildFooterComponent(), buildHeaderComponent(), buildMetaTemplatePayload(), CATEGORY_TO_META, MetaButtonPayload (+2 more)

### Community 63 - "route.ts"
Cohesion: 0.25
Nodes (10): extractSampleValues(), MetaButton, MetaTemplate, MetaTemplateComponent, normalizeCategory(), normalizeQualityScore(), parseButtons(), POST() (+2 more)

### Community 64 - "conversations-chart.tsx"
Cohesion: 0.25
Nodes (9): ConversationsChart(), ConversationsChartProps, LineSvg(), longDayLabel(), niceCeil(), PADDING, RangeDays, shortDayLabel() (+1 more)

### Community 65 - "use-broadcast-sending.ts"
Cohesion: 0.18
Nodes (8): AudienceConfig, BroadcastApiResult, BroadcastPayload, CustomFieldFilter, CustomFieldOperator, CustomValueIndex, UseBroadcastSendingReturn, VariableMapping

### Community 66 - "sleep()"
Cohesion: 0.20
Nodes (5): sleep(), builder(), h, resolve(), triggerMatches()

### Community 67 - "matrixPricingService.ts"
Cohesion: 0.38
Nodes (9): calculateServiceQuote(), deleteMatrixRule(), getMatrixRulesForService(), getSupabaseClient(), MatrixQuoteResult, upsertMatrixRule(), MatrixPricingModal(), MatrixPricingModalProps (+1 more)

### Community 68 - "server.json"
Cohesion: 0.20
Nodes (9): description, name, packages, repository, source, subfolder, url, $schema (+1 more)

### Community 69 - "crm"
Cohesion: 0.20
Nodes (10): crm, whatsapp, keywords, automation, broadcast, nextjs, self-hosted, supabase (+2 more)

### Community 70 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, start, test (+2 more)

### Community 71 - "route.ts"
Cohesion: 0.33
Nodes (7): GET(), PATCH(), POST(), ContactError, getContactById(), resolveAuditUserId(), setContactTags()

### Community 72 - "route.ts"
Cohesion: 0.33
Nodes (6): DELETE(), EDITABLE_STATUSES, isDryRun(), PATCH(), deleteMessageTemplate(), editMessageTemplate()

### Community 73 - "ai-thread-banner.tsx"
Cohesion: 0.24
Nodes (7): AiAccountStatus, AiThreadBanner(), AiThreadBannerProps, fetchAiAccountStatus(), parseBriefing(), ParsedBriefing, statusCache

### Community 74 - "customerAssetService.ts"
Cohesion: 0.31
Nodes (8): CreateAssetInput, createOrUpdateCustomerAsset(), getAssetServiceHistory(), getAssetsForContact(), getSupabaseClient(), recordAssetServiceHistory(), CustomerAsset, CustomerAssetHistory

### Community 75 - "message_templates table"
Cohesion: 0.22
Nodes (9): message_templates table, profiles table, MembersTab, ProfileForm, QuickRepliesManager, SettingsOverview, SettingsPanelHead, TemplateManager (+1 more)

### Community 76 - "page.tsx"
Cohesion: 0.39
Nodes (5): Appointment, Provider, Service, useBooking(), BookingDashboard()

### Community 77 - "page.tsx"
Cohesion: 0.25
Nodes (7): EVENT_COLOR, EventLine(), EventRow, RunCard(), RunRow, STATUS_META, summarizePayload()

### Community 78 - "portfolioService.ts"
Cohesion: 0.50
Nodes (7): addPortfolioMedia(), deletePortfolioMedia(), getSupabaseClient(), listPortfolioMedia(), PortfolioMediaManager(), PortfolioMediaManagerProps, PortfolioMedia

### Community 79 - "scopes.ts"
Cohesion: 0.46
Nodes (6): API_SCOPES, ApiScope, hasScope(), isApiScope(), normalizeScopes(), SCOPE_DESCRIPTIONS

### Community 80 - "overrides"
Cohesion: 0.29
Nodes (7): overrides, @babel/core, fast-uri, hono, ip-address, js-yaml, postcss

### Community 81 - "contact-sidebar.tsx"
Cohesion: 0.33
Nodes (5): ContactSidebarProps, InboxAiAssistant(), InboxAiAssistantProps, Turn, ContactNote

### Community 82 - "sidebar.tsx"
Cohesion: 0.29
Nodes (6): bottomNavItems, NavItem, navItems, ROLE_CHIP, Sidebar(), SidebarProps

### Community 83 - "parse-contact-csv.ts"
Cohesion: 0.48
Nodes (5): parseContactCsv(), ParseContactCsvResult, parseCsvLine(), ParsedContactRow, parseTagCell()

### Community 84 - "conversations.ts"
Cohesion: 0.29
Nodes (4): ContactFilters, RawContact, RawConversation, tag()

### Community 85 - "opus-recorder.d.ts"
Cohesion: 0.29
Nodes (3): opus-recorder, Recorder, RecorderConfig

### Community 86 - "react"
Cohesion: 0.40
Nodes (5): react, react, ChartLegend(), ScrollButton(), useOnWindowResize()

### Community 87 - "page.tsx"
Cohesion: 0.40
Nodes (3): Tab, AiPlayground(), Turn

### Community 88 - "Account Invitations Table"
Cohesion: 0.33
Nodes (6): Account Invitations Table, Accounts Table, remove_account_member, transfer_account_ownership, peek_invitation, redeem_invitation

### Community 89 - "route.ts"
Cohesion: 0.50
Nodes (4): GET(), AutomationContext, markPending(), resumePendingExecution()

### Community 90 - "header.tsx"
Cohesion: 0.50
Nodes (4): getPageTitleKey(), Header(), HeaderProps, pageTitles

### Community 91 - "Flow Nodes Table"
Cohesion: 0.40
Nodes (5): Flow Nodes Table, Flow Run Events Table, Flow Runs Table, Flows Table, increment_flow_execution_count

### Community 92 - "glama.json"
Cohesion: 0.50
Nodes (3): maintainers, $schema, ArnasDon

### Community 93 - "next.config.ts"
Cohesion: 0.50
Nodes (3): nextConfig, SECURITY_HEADERS, withNextIntl

### Community 100 - "AI Knowledge Chunks Table"
Cohesion: 0.50
Nodes (4): AI Knowledge Chunks Table, AI Knowledge Documents Table, match_ai_knowledge_fts, match_ai_knowledge_semantic

### Community 101 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 106 - "PasswordForm"
Cohesion: 0.67
Nodes (3): PasswordForm, SecurityPanel, SessionsCard

### Community 109 - "Profiles Table (Beta Features)"
Cohesion: 0.67
Nodes (3): Profiles Table (Beta Features), is_account_member, set_member_role

## Knowledge Gaps
- **585 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+580 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `page.tsx` to `activity-feed.tsx`, `conversations-chart.tsx`, `page.tsx`, `page.tsx`, `ForgotPasswordPage()`, `message-bubble.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `ai-usage.tsx`, `AiUsageCard()`, `Query: Multi-tenant architecture and RLS`, `layout.tsx`, `page.tsx`, `page.tsx`, `bar-chart.tsx`, `deal-card.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `dependencies` connect `class-variance-authority` to `@xyflow/react`, `@base-ui/react`, `@dnd-kit/core`, `next`, `next-intl`, `opus-recorder`, `react`, `recharts`, `tailwind-merge`, `package.json`, `tw-animate-css`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `class-variance-authority`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _585 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05239075726378403 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05711849957374254 - nodes in this community are weakly interconnected._
- **Should `route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07132867132867132 - nodes in this community are weakly interconnected._