# Graph Report - .  (2026-07-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2238 nodes · 5879 edges · 167 communities (106 shown, 61 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26f669c2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- account.test.ts
- template-status.ts
- webhook-signature.test.ts
- AI Knowledge Chunks Table
- (auth)/layout.tsx
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
- next-intl
- opus-recorder
- recharts
- sonner
- tw-animate-css
- @xyflow/react
- postcss.config.mjs
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
- Feature Request Template
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 180 edges
2. `createClient()` - 79 edges
3. `toErrorResponse()` - 64 edges
4. `useAuth()` - 61 edges
5. `requireRole()` - 59 edges
6. `createClient()` - 52 edges
7. `Button()` - 46 edges
8. `checkRateLimit()` - 43 edges
9. `requireApiKey()` - 39 edges
10. `rateLimitResponse()` - 39 edges

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
- 4-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-components.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 4-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-send-builder.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 5-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-components.ts -> src/lib/whatsapp/template-validators.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 5-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-send-builder.ts -> src/lib/whatsapp/template-validators.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`

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

## Communities (167 total, 61 thin omitted)

### Community 0 - "flow-canvas.tsx"
Cohesion: 0.05
Nodes (69): FlowBuilder(), NodeConfigWithAdvanced(), ADD_NODE_TYPES, CanvasAddNodeButton(), FlowCanvas(), FlowCanvasInner(), FlowNodeCard(), NODE_TYPES (+61 more)

### Community 1 - "contacts/page.tsx"
Cohesion: 0.08
Nodes (45): TEMPLATE_ICON, TEMPLATE_ORDER, ContactWithTags, describeTrigger(), FlowCard(), FlowRow, STATUS_COLORS, STATUS_LABELS() (+37 more)

### Community 2 - "cn"
Cohesion: 0.06
Nodes (43): PreviewCell(), Skeleton(), SkeletonCard(), AddNodeButton(), NodeCard(), NodeKeySelect(), NodeIconChip(), IssueLine() (+35 more)

### Community 3 - "automation-builder.tsx"
Cohesion: 0.05
Nodes (45): ADDABLE_STEPS, AgentSelect(), ApiStep, asInteractive(), AutomationBuilder(), AutomationResources, blankConfig(), BuilderInitial (+37 more)

### Community 4 - "toErrorResponse"
Cohesion: 0.12
Nodes (44): RFC-6585, DELETE(), GET(), POST(), IMPORTANT: the plaintext key is returned exactly ONCE, in the POST, DELETE(), GET(), GET() (+36 more)

### Community 5 - "createClient"
Cohesion: 0.06
Nodes (45): ForgotPasswordPage(), NewBroadcastPage(), steps, ContactsPage(), DashboardShell(), DashboardShellInner(), metadata, NotificationsPage() (+37 more)

### Community 6 - "auto-reply.ts"
Cohesion: 0.07
Nodes (33): Adding a New AI Provider, POST /api/ai/config, POST(), POST(), POST(), POST /api/ai/test, AiConfig Component, supabaseAdmin() (+25 more)

### Community 7 - "button.tsx"
Cohesion: 0.11
Nodes (34): Query: Multi-tenant architecture and RLS, FAIL_COPY, JoinPage(), PeekFail, PeekOk, PeekResult, ROLE_LABEL, categoryColors (+26 more)

### Community 8 - "encoderWorker.min.js"
Cohesion: 0.06
Nodes (23): abort(), abortOnCannotGrowMemory(), addOnPostRun(), addOnPreRun(), addRunDependency(), assert(), callRuntimeCallbacks(), createWasm() (+15 more)

### Community 9 - "broadcasts/[id]/page.tsx"
Cohesion: 0.08
Nodes (38): RFC-4180, AutomationsPage(), BroadcastDetailPage(), FunnelStep, RECIPIENT_STATUSES, StatCardProps, BroadcastsPage(), percent() (+30 more)

### Community 10 - "types/index.ts"
Cohesion: 0.06
Nodes (44): GET(), DraftState, useUnreadNotifications(), appendResults(), AutomationContext, evaluateCondition(), ExecuteArgs, executeStepsFrom() (+36 more)

### Community 11 - "flows/engine.ts"
Cohesion: 0.11
Nodes (44): ContactOutcome, ContactRow, findOrCreateContact(), findOrCreateConversation(), flagBroadcastReplyIfAny(), GET(), handleReaction(), handleStatusUpdate() (+36 more)

### Community 12 - "template-manager.tsx"
Cohesion: 0.07
Nodes (38): UsageResponse, WINDOWS, contactFields, isMediaHeaderType(), isValidHttpUrl(), MEDIA_HEADER_TYPES, MediaHeaderType, SAMPLE_CONTACT (+30 more)

### Community 13 - "flows/types.ts"
Cohesion: 0.07
Nodes (37): GET(), GET(), decideFallback(), FallbackAction, resolveFallbackPolicy(), POLICY_REPROMPT_2_HANDOFF, FAQ_BOT, FlowTemplate (+29 more)

### Community 14 - "meta-api.ts"
Cohesion: 0.06
Nodes (38): NewRecipient, GET(), SendMediaEngineArgs, DeleteMessageTemplateArgs, downloadMedia(), DownloadMediaArgs, EditMessageTemplateArgs, EditMessageTemplateResult (+30 more)

### Community 15 - "customerAssetService.ts"
Cohesion: 0.11
Nodes (33): ICON_MAP, IndustryConfig(), IndustryConfigProps, CreateAssetInput, createOrUpdateCustomerAsset(), deleteAssetServiceHistory(), deleteCustomerAsset(), getAssetServiceHistory() (+25 more)

### Community 16 - "BookingDashboard.tsx"
Cohesion: 0.09
Nodes (27): ContactDetailViewProps, collectVariableSlots(), renderBodyPreview(), TemplatePicker(), TemplateSendValues, UrlButtonSlot, Badge(), badgeVariants (+19 more)

### Community 17 - "members-tab.tsx"
Cohesion: 0.09
Nodes (32): SettingsPage(), PRESENCE_DOT_CLASS, PresenceDot(), EDITABLE_ROLES, fmtDate(), fmtExpiresIn(), Invitation, MembersTab() (+24 more)

### Community 18 - "WacrmClient"
Cohesion: 0.14
Nodes (16): Paginated, WacrmApiError, WacrmClient, Config, loadConfig(), truthy(), main(), registerBroadcastTools() (+8 more)

### Community 19 - "decrypt"
Cohesion: 0.16
Nodes (27): BroadcastResult, POST(), sendViaMeta(), engineSendMedia(), engineSendText(), SendInput, SendInteractiveButtonsEngineArgs, SendInteractiveListEngineArgs (+19 more)

### Community 20 - "supabaseAdmin"
Cohesion: 0.14
Nodes (26): DELETE(), GET(), PATCH(), requireUser(), GET(), POST(), DELETE(), PATCH() (+18 more)

### Community 21 - "requireApiKey"
Cohesion: 0.12
Nodes (22): GET(), generateApiKey(), GeneratedApiKey, hashApiKey(), looksLikeApiKey(), timingSafeHexEqual(), ApiKeyRow, findActiveKeyByHash() (+14 more)

### Community 22 - "use-theme.tsx"
Cohesion: 0.13
Nodes (24): inter, metadata, viewport, ModeToggle(), AppearancePanel(), ModeCard(), ThemeCard(), noopSubscribe() (+16 more)

### Community 23 - "contacts.ts"
Cohesion: 0.14
Nodes (20): ApiContact, ContactError, ContactInput, findOrCreateContact(), RawTagJoin, dedupeByPhone(), ExistingContact, findExistingContact() (+12 more)

### Community 24 - "createClient"
Cohesion: 0.15
Nodes (18): POST(), POST(), DELETE(), GET(), PUT(), PutBody, requireOwnership(), GET() (+10 more)

### Community 25 - "Conversation"
Cohesion: 0.14
Nodes (19): GET(), ConversationList(), MessageThreadProps, RealtimeEvent, useRealtime(), UseRealtimeOptions, ApiConversation, ApiMessage (+11 more)

### Community 26 - "dependencies"
Cohesion: 0.08
Nodes (25): clsx, @dagrejs/dagre, date-fns, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, next, dependencies (+17 more)

### Community 27 - "bar-chart.tsx"
Cohesion: 0.11
Nodes (21): BarChartEventProps, BarChartProps, BaseEventProps, ChartTooltip(), ChartTooltipProps, deepEqual(), HasScrollProps, Legend (+13 more)

### Community 28 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 29 - "message-thread.tsx"
Cohesion: 0.13
Nodes (17): ContactSidebar(), ComposerMediaKind, formatDuration(), MediaDraft, MessageComposer(), MessageComposerProps, PICKER_ACCEPT, ReplyDraft (+9 more)

### Community 30 - "send-message.ts"
Cohesion: 0.16
Nodes (15): encrypt(), isLegacyFormat(), InteractiveMessagePayload, ContactRow, from(), Script, MEDIA_KINDS, SendMessageError (+7 more)

### Community 31 - "deliver.ts"
Cohesion: 0.16
Nodes (14): RFC-1918, deliverOne(), dispatchWebhookEvent(), EndpointRow, recordFailure(), Calls, makeDb(), Row (+6 more)

### Community 32 - "invitations/route.ts"
Cohesion: 0.21
Nodes (16): getBaseUrl(), isHostAllowed(), parseAllowedHosts(), POST(), IMPORTANT: the plaintext token is returned exactly ONCE — in, GET(), getClientIp(), getClientIp() (+8 more)

### Community 33 - "supabaseAdmin"
Cohesion: 0.20
Nodes (13): supabaseAdmin(), POST(), GET(), addMinutesToTime(), BookingInput, createAppointment(), rescheduleAppointment(), toUTCISOString() (+5 more)

### Community 34 - "currency.ts"
Cohesion: 0.19
Nodes (16): AiUsageCard(), DealCard(), DealCardProps, formatDate(), initials(), DealFormProps, PipelineAnalyticsProps, PipelineBoard() (+8 more)

### Community 35 - "mcp-server/package.json"
Cohesion: 0.10
Nodes (19): author, bin, wacrm-mcp, description, engines, node, files, homepage (+11 more)

### Community 36 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+11 more)

### Community 37 - "contacts/route.ts"
Cohesion: 0.29
Nodes (13): GET(), sanitizeSearch(), GET(), GET(), serializeContact(), buildPage(), Cursor, decodeCursor() (+5 more)

### Community 38 - "message-bubble.tsx"
Cohesion: 0.16
Nodes (10): MessageBubble(), MessageBubbleProps, groupReactions(), MessageReactions(), MessageReactionsProps, ReactionGroup, ReplyQuote(), ReplyQuoteProps (+2 more)

### Community 39 - "interactive.ts"
Cohesion: 0.18
Nodes (16): QuickReplyPicker(), QuickReplyPickerProps, fail(), InteractiveButton, InteractiveButtonsPayload, InteractiveListPayload, InteractiveListRow, InteractiveListSection (+8 more)

### Community 40 - "toApiErrorResponse"
Cohesion: 0.35
Nodes (14): GET(), POST(), GET(), PATCH(), POST(), POST(), DELETE(), GET() (+6 more)

### Community 41 - "webhooks/route.ts"
Cohesion: 0.27
Nodes (12): PATCH(), GET(), POST(), ApiWebhookEndpoint, generateWebhookSecret(), normalizeWebhookUrl(), serializeWebhookEndpoint(), isWebhookEvent() (+4 more)

### Community 42 - "MessageTemplate"
Cohesion: 0.12
Nodes (15): Step1Props, Step3Props, Step4Props, TemplatePickerProps, TemplateFormData, AudienceConfig, BroadcastApiResult, BroadcastPayload (+7 more)

### Community 43 - "throwMetaError"
Cohesion: 0.22
Nodes (12): DELETE(), GET(), POST(), resolveAccountId(), supabaseAdmin(), GET(), getSubscribedApps(), registerPhoneNumber() (+4 more)

### Community 44 - "queries.ts"
Cohesion: 0.36
Nodes (12): GET(), UsageRow, daysAgoStart(), DOW_SHORT_MON_FIRST, lastNDayKeys(), localDayKey(), mondayIndex(), startOfLocalDay() (+4 more)

### Community 45 - "automations/new/page.tsx"
Cohesion: 0.22
Nodes (14): expandFromSeeds(), NewAutomationPage(), SeedRow, uid(), BuilderStep, DispatchInput, AUTOMATION_TEMPLATES, AutomationTemplateDefinition (+6 more)

### Community 46 - "knowledge.ts"
Cohesion: 0.21
Nodes (9): chunkText(), EmbeddingResponse, embedTexts(), toVectorLiteral(), ingestDocument(), MatchRow, retrieveKnowledge(), FakeState (+1 more)

### Community 47 - "anthropic.ts"
Cohesion: 0.36
Nodes (12): AnthropicResponse, generateAnthropic(), normalizeForAnthropic(), generateOpenAi(), OpenAiResponse, generateOpenRouter(), OpenRouterResponse, mergeConsecutive() (+4 more)

### Community 48 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir (+7 more)

### Community 49 - "package.json"
Cohesion: 0.13
Nodes (14): author, bugs, url, description, engines, node, homepage, license (+6 more)

### Community 50 - "activity-feed.tsx"
Cohesion: 0.17
Nodes (13): ActivityFeed(), ActivityFeedProps, KIND_THEME, KindTheme, PAGE_SIZES, PageSize, relativeTime(), ActivityItem (+5 more)

### Community 51 - "template-components.ts"
Cohesion: 0.21
Nodes (13): buildBodyComponent(), buildButtonPayload(), buildButtonsComponent(), buildFooterComponent(), buildHeaderComponent(), buildMetaTemplatePayload(), CATEGORY_TO_META, MetaButtonPayload (+5 more)

### Community 52 - "template-validators.ts"
Cohesion: 0.33
Nodes (13): assertContiguous(), countButtonsByType(), extractVariableIndices(), HeaderValidationResult, TEMPLATE_LIMITS, baseValid, validateBody(), validateButtons() (+5 more)

### Community 53 - "dashboard/page.tsx"
Cohesion: 0.20
Nodes (11): DashboardPage(), deltaLabel(), RangeDays, DeltaRow(), MetricCard(), MetricCardProps, Action, ACTIONS (+3 more)

### Community 54 - "pipeline-donut.tsx"
Cohesion: 0.16
Nodes (8): arcPath(), Donut(), PipelineDonut(), PipelineDonutProps, PipelineDonutData, opus-recorder, Recorder, RecorderConfig

### Community 55 - "use-presence.ts"
Cohesion: 0.26
Nodes (10): PresenceMap, UsePresenceResult, derivePresence(), formatLastSeen(), presenceLabel(), PresenceRow, PresenceStatus, StoredPresence (+2 more)

### Community 56 - "compilerOptions"
Cohesion: 0.14
Nodes (14): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+6 more)

### Community 57 - "wacrm README"
Cohesion: 0.18
Nodes (13): MCP Documentation, Public REST API Documentation, Hostinger Deploy Screenshot, MCP Server README, wacrm README, AI Reply Assistant, No-code Automations, Broadcasts & Templates (+5 more)

### Community 58 - "automations/engine.test.ts"
Cohesion: 0.18
Nodes (7): sleep(), executeAutomation(), runAutomationsForTrigger(), builder(), h, resolve(), triggerMatches()

### Community 59 - "template-webhook.ts"
Cohesion: 0.23
Nodes (10): handleComponentsUpdate(), handleQualityUpdate(), handleStatusUpdate(), handleTemplateWebhookChange(), isTemplateWebhookField(), TEMPLATE_WEBHOOK_FIELDS, TemplateComponentsUpdateValue, TemplateQualityUpdateValue (+2 more)

### Community 60 - "keywords"
Cohesion: 0.17
Nodes (12): dependencies, @modelcontextprotocol/sdk, zod, crm, keywords, @modelcontextprotocol/sdk, whatsapp, ai (+4 more)

### Community 61 - "send/route.ts"
Cohesion: 0.24
Nodes (9): findOrCreateConversation(), POST(), SendSupabase, CONTACT, conversationInserts, messageInserts, postContactTemplate(), { sendTemplateMessage } (+1 more)

### Community 62 - "template-send-builder.ts"
Cohesion: 0.24
Nodes (10): makeDb(), buildBodyComponent(), buildButtonComponent(), buildHeaderComponent(), buildSendComponents(), buttonNeedsSendParam(), MetaSendComponent, MetaSendParameter (+2 more)

### Community 63 - "logs/page.tsx"
Cohesion: 0.24
Nodes (9): AutomationLogsPage(), StatusBadge(), StepRow(), AutomationCard(), formatRelative(), TRIGGER_META, triggerMeta, AutomationLog (+1 more)

### Community 64 - "conversations-chart.tsx"
Cohesion: 0.25
Nodes (9): ConversationsChart(), ConversationsChartProps, LineSvg(), longDayLabel(), niceCeil(), PADDING, RangeDays, shortDayLabel() (+1 more)

### Community 65 - "automations/meta-send.ts"
Cohesion: 0.25
Nodes (10): runStep(), engineSendInteractive(), engineSendTemplate(), engineSendText(), SendInput, SendInteractiveArgs, SendTemplateArgs, SendTextArgs (+2 more)

### Community 66 - "server.json"
Cohesion: 0.20
Nodes (9): description, name, packages, repository, source, subfolder, url, $schema (+1 more)

### Community 67 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, start, test (+2 more)

### Community 68 - "templates/[id]/route.ts"
Cohesion: 0.33
Nodes (6): DELETE(), EDITABLE_STATUSES, isDryRun(), PATCH(), deleteMessageTemplate(), editMessageTemplate()

### Community 69 - "ai-thread-banner.tsx"
Cohesion: 0.24
Nodes (7): AiAccountStatus, AiThreadBanner(), AiThreadBannerProps, fetchAiAccountStatus(), parseBriefing(), ParsedBriefing, statusCache

### Community 70 - "SettingsPanelHead"
Cohesion: 0.22
Nodes (9): message_templates table, profiles table, MembersTab, ProfileForm, QuickRepliesManager, SettingsOverview, SettingsPanelHead, TemplateManager (+1 more)

### Community 71 - "keywords"
Cohesion: 0.22
Nodes (9): crm, keywords, automation, broadcast, nextjs, self-hosted, supabase, template (+1 more)

### Community 72 - "submit/route.ts"
Cohesion: 0.39
Nodes (6): buildUpsertRow(), POST(), upsertTemplateRow(), submitMessageTemplate(), ALLOWED, normalizeStatus()

### Community 73 - "sync/route.ts"
Cohesion: 0.33
Nodes (8): extractSampleValues(), MetaButton, MetaTemplate, MetaTemplateComponent, normalizeCategory(), normalizeQualityScore(), parseButtons(), POST()

### Community 74 - "runs/page.tsx"
Cohesion: 0.25
Nodes (7): EVENT_COLOR, EventLine(), EventRow, RunCard(), RunRow, STATUS_META, summarizePayload()

### Community 75 - "pipeline-analytics.tsx"
Cohesion: 0.36
Nodes (6): computeStageProbability(), PipelineAnalytics(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 76 - "template-header-handle.ts"
Cohesion: 0.33
Nodes (4): calls, uploadResumableMedia(), ALLOWED_IMAGE_TYPES, ensureImageHeaderHandle()

### Community 77 - "PortfolioMediaManager.tsx"
Cohesion: 0.50
Nodes (7): addPortfolioMedia(), deletePortfolioMedia(), getSupabaseClient(), listPortfolioMedia(), PortfolioMediaManager(), PortfolioMediaManagerProps, PortfolioMedia

### Community 78 - "mcp-server/tsconfig.json"
Cohesion: 0.25
Nodes (6): exclude, include, dist, src/**/*, exclude, node_modules

### Community 79 - "response-time-chart.tsx"
Cohesion: 0.36
Nodes (6): EmptyState(), fmt(), ResponseTimeChart(), ResponseTimeChartProps, BarChart, ResponseTimeSummary

### Community 80 - "scopes.ts"
Cohesion: 0.46
Nodes (6): API_SCOPES, ApiScope, hasScope(), isApiScope(), normalizeScopes(), SCOPE_DESCRIPTIONS

### Community 81 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @types/node, typescript, @types/node, typescript, @types/node, typescript

### Community 82 - "overrides"
Cohesion: 0.29
Nodes (7): overrides, @babel/core, fast-uri, hono, ip-address, js-yaml, postcss

### Community 83 - "include"
Cohesion: 0.29
Nodes (7): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx, include

### Community 84 - "sidebar.tsx"
Cohesion: 0.29
Nodes (6): bottomNavItems, NavItem, navItems, ROLE_CHIP, Sidebar(), SidebarProps

### Community 85 - "parse-contact-csv.ts"
Cohesion: 0.48
Nodes (5): parseContactCsv(), ParseContactCsvResult, parseCsvLine(), ParsedContactRow, parseTagCell()

### Community 86 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, prepublishOnly, start, typecheck

### Community 87 - "react"
Cohesion: 0.40
Nodes (5): react, react, ChartLegend(), ScrollButton(), useOnWindowResize()

### Community 88 - "agents/page.tsx"
Cohesion: 0.40
Nodes (3): Tab, AiPlayground(), Turn

### Community 89 - "Account Invitations Table"
Cohesion: 0.33
Nodes (6): Account Invitations Table, Accounts Table, remove_account_member, transfer_account_ownership, peek_invitation, redeem_invitation

### Community 90 - "layout/header.tsx"
Cohesion: 0.50
Nodes (4): getPageTitleKey(), Header(), HeaderProps, pageTitles

### Community 92 - "sendMediaMessage"
Cohesion: 0.40
Nodes (3): BASE, CapturedBody, sendMediaMessage()

### Community 93 - "Flows Table"
Cohesion: 0.40
Nodes (5): Flow Nodes Table, Flow Run Events Table, Flow Runs Table, Flows Table, increment_flow_execution_count

### Community 94 - "glama.json"
Cohesion: 0.50
Nodes (3): maintainers, $schema, ArnasDon

### Community 95 - "next.config.ts"
Cohesion: 0.50
Nodes (3): nextConfig, SECURITY_HEADERS, withNextIntl

### Community 96 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 101 - "template-status.ts"
Cohesion: 0.50
Nodes (3): templateStatusConfig, TemplateStatusDisplay, MessageTemplateStatus

### Community 103 - "AI Knowledge Chunks Table"
Cohesion: 0.50
Nodes (4): AI Knowledge Chunks Table, AI Knowledge Documents Table, match_ai_knowledge_fts, match_ai_knowledge_semantic

### Community 108 - "SecurityPanel"
Cohesion: 0.67
Nodes (3): PasswordForm, SecurityPanel, SessionsCard

### Community 111 - "Profiles Table (Beta Features)"
Cohesion: 0.67
Nodes (3): Profiles Table (Beta Features), is_account_member, set_member_role

### Community 112 - "paths"
Cohesion: 0.67
Nodes (3): paths, ./src/*, @/*

## Knowledge Gaps
- **574 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+569 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `flow-canvas.tsx`, `contacts/page.tsx`, `createClient`, `button.tsx`, `broadcasts/[id]/page.tsx`, `template-manager.tsx`, `BookingDashboard.tsx`, `members-tab.tsx`, `use-theme.tsx`, `Conversation`, `bar-chart.tsx`, `message-bubble.tsx`, `activity-feed.tsx`, `dashboard/page.tsx`, `logs/page.tsx`, `conversations-chart.tsx`, `runs/page.tsx`, `pipeline-analytics.tsx`, `response-time-chart.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `tw-animate-css`, `package.json`, `@base-ui/react`, `@dnd-kit/core`, `react`, `next-intl`, `opus-recorder`, `recharts`, `sonner`, `class-variance-authority`, `@xyflow/react`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _574 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `flow-canvas.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05450372920252438 - nodes in this community are weakly interconnected._
- **Should `contacts/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08186341022161918 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05780885780885781 - nodes in this community are weakly interconnected._