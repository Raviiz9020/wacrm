# Graph Report - .  (2026-07-15)

## Corpus Check
- 6 files · ~299,500 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2213 nodes · 5979 edges · 151 communities (93 shown, 58 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- AI Auto-Reply & Knowledge Base
- Dashboard Charts & Activity Feed
- Flow Execution Engine
- Settings Forms & Playground Pages
- Authentication & Shell Layouts
- No-Code Automation Builder
- Broadcast Wizard & Templates
- Automation Database & Execution Helpers
- Meta WhatsApp API Integration
- Broadcast & Funnel Analytics Pages
- MCP Server & Client SDK
- Opus Audio WebAssembly Encoder
- API Routes & Rate Limiting
- Contact Deduplication & Broadcast Core
- Deals Pipelines & Currency Formatters
- AI Knowledge Base & Account Auth
- Core UI Components
- Project Dependencies & MCP Package Config
- Team Settings & Member Invites
- Role-Based Access Control (RBAC)
- Module: appendResults()
- Module: LoginPage()
- Module: computeStageProbability()
- Module: inter
- Module: resolveAccountId()
- Module: ConversationItem()
- Module: BarChartEventProps
- Module: POST()
- Module: engineSendInteractive()
- Module: FlowCanvas()
- Module: ContactOutcome
- Module: fetchAccountMembers()
- Module: AiPlayground()
- Module: usePresence()
- Module: dependencies
- Module: AutomationBuilder()
- Module: SendInteractiveArgs
- Module: aliases
- Module: POST()
- Module: findActiveKeyByHash()
- Module: ADD_NODE_TYPES
- Module: ButtonsEditor()
- Module: DELETE()
- Module: ContactFilters
- Module: compilerOptions
- Module: AddNodeButton()
- Module: NextNodeRow()
- Module: clampExpiryDays()
- Module: ComposerMediaKind
- Module: deliverOne()
- Module: compilerOptions
- Module: generateApiKey()
- Module: GET()
- Module: collectVariableSlots()
- Module: author
- Module: MediaImage()
- Module: PresenceMap
- Module: MCP Documentation
- Module: findOrCreateConversation()
- Module: ExecuteArgs
- Community 60
- Module: devDependencies
- Module: TemplateFormData
- Module: buildBodyComponent()
- Module: handleComponentsUpdate()
- Community 65
- Module: applyEdgeConnection()
- Module: FlowInput
- Module: MessageActions()
- Module: calls
- Module: FlowBuilder()
- Module: EDITABLE_STATUSES
- Module: description
- Module: scripts
- Community 74
- Module: autoLayout()
- Module: EVENT_COLOR
- Module: buildUpsertRow()
- Community 78
- Community 79
- Module: parseContactCsv()
- Module: overrides
- Module: BuilderCall
- Module: nextConfig
- Module: Icon()
- Module: AuthLayout()
- Module: JoinLayout()
- Module: maintainers
- Module: config
- Module: refreshedCookies
- Module: Recorder
- Module: Next.js Agent Rules
- Module: RootPage()
- Module: eslintConfig
- Module: config
- Module: Changelog
- Module: Contributing Guide
- Module: Code of Conduct
- Module: Dependabot Config
- Module: Pull Request Template
- Module: Security Policy
- Module: request.ts
- Module: Bug Report Template
- Module: Issue Config
- Module: Feature Request Template
- Module: File SVG Icon
- Module: Globe SVG Icon
- Module: Inbox Doodle SVG Image
- Module: Next.js SVG Icon
- Module: Vercel SVG Icon
- Module: Window SVG Icon
- Module: GitHub CI Workflow
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 150

## God Nodes (most connected - your core abstractions)
1. `cn()` - 193 edges
2. `createClient()` - 84 edges
3. `useAuth()` - 71 edges
4. `toErrorResponse()` - 64 edges
5. `requireRole()` - 59 edges
6. `createClient()` - 53 edges
7. `Button()` - 48 edges
8. `checkRateLimit()` - 44 edges
9. `requireApiKey()` - 39 edges
10. `rateLimitResponse()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Adding a New AI Provider` --references--> `generateReply()`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/generate.ts
- `Adding a New AI Provider` --references--> `Migration: Add Gemini Provider`  [EXTRACTED]
  docs/add-ai-provider.md → supabase/migrations/040_add_gemini_provider.sql
- `Adding a New AI Provider` --references--> `AI_PROVIDER_DEFAULT_MODEL`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/defaults.ts
- `Adding a New AI Provider` --references--> `AiProvider`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/types.ts
- `ScrollButton()` --references--> `react`  [EXTRACTED]
  src/components/tremor/bar-chart.tsx → package.json

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
- **Inbox Feature Set** — src_components_inbox_message_thread_messagethread, src_components_inbox_conversation_list_conversationlist, src_components_inbox_contact_sidebar_contactsidebar, src_components_inbox_message_composer_messagecomposer [INFERRED 0.90]
- **Pipeline Management** — src_components_pipelines_pipeline_board_pipelineboard, src_components_pipelines_deal_form_dealform, src_components_pipelines_pipeline_analytics_pipelineanalytics, src_components_pipelines_pipeline_settings_pipelinesettings [INFERRED 0.90]
- **Settings Redesign Components** — src_components_settings_settings_overview_settings_overview, src_components_settings_settings_rail_settings_rail, src_components_settings_settings_panel_head_settings_panel_head [INFERRED 0.80]
- **Authentication & Profile Management** — src_components_settings_profile_form_profile_form, src_components_settings_password_form_password_form, src_components_settings_sessions_card_sessions_card, src_hooks_use_auth_use_auth [EXTRACTED 0.90]
- **Multi-Tenant Account Sharing System** — supabase_migrations_017_account_sharing_accounts, supabase_migrations_017_account_sharing_account_invitations, supabase_migrations_017_account_sharing_is_account_member, supabase_migrations_018_account_member_rpcs_set_member_role, supabase_migrations_019_invitation_rpcs_redeem_invitation [EXTRACTED 1.00]
- **AI Reply Assistant & Knowledge Base** — supabase_migrations_029_ai_reply_ai_configs, supabase_migrations_030_ai_knowledge_ai_knowledge_documents, supabase_migrations_030_ai_knowledge_ai_knowledge_chunks, supabase_migrations_033_ai_reply_polish_ai_usage_log [EXTRACTED 1.00]
- **Conversational Flows Engine** — supabase_migrations_010_flows_flows, supabase_migrations_010_flows_flow_nodes, supabase_migrations_010_flows_flow_runs, supabase_migrations_010_flows_flow_run_events, supabase_migrations_016_flow_media_flow_media_bucket [EXTRACTED 1.00]

## Communities (151 total, 58 thin omitted)

### Community 0 - "AI Auto-Reply & Knowledge Base"
Cohesion: 0.05
Nodes (71): AddNodeButton(), FlowBuilder(), NodeCard(), NodeConfigWithAdvanced(), CanvasAddNodeButton(), FlowCanvas(), FlowCanvasInner(), FlowNodeCard() (+63 more)

### Community 1 - "Dashboard Charts & Activity Feed"
Cohesion: 0.09
Nodes (46): describeTrigger(), FlowCard(), FlowRow, STATUS_COLORS, STATUS_LABELS(), TEMPLATE_ICONS, TemplateSummary, SPEC_DEFAULT_STAGES (+38 more)

### Community 2 - "Flow Execution Engine"
Cohesion: 0.05
Nodes (49): AiAccountStatus, AiThreadBanner(), AiThreadBannerProps, Banner(), fetchAiAccountStatus(), statusCache, MessageActions(), MessageBubble() (+41 more)

### Community 3 - "Settings Forms & Playground Pages"
Cohesion: 0.11
Nodes (46): RFC-6585, DELETE(), GET(), POST(), IMPORTANT: the plaintext key is returned exactly ONCE, in the POST, DELETE(), GET(), DELETE() (+38 more)

### Community 4 - "Authentication & Shell Layouts"
Cohesion: 0.07
Nodes (45): Query: Multi-tenant architecture and RLS, Turn, Skeleton(), SkeletonCard(), NodeKeySelect(), ROLE_META, ChipVariant, SettingsChip() (+37 more)

### Community 5 - "No-Code Automation Builder"
Cohesion: 0.07
Nodes (47): ForgotPasswordPage(), LoginPageInner(), SignupPageInner(), DashboardShell(), DashboardShellInner(), InboxPage(), metadata, NotificationsPage() (+39 more)

### Community 6 - "Broadcast Wizard & Templates"
Cohesion: 0.05
Nodes (43): ADDABLE_STEPS, AgentSelect(), ApiStep, asInteractive(), AutomationBuilder(), AutomationResources, blankConfig(), BuilderInitial (+35 more)

### Community 7 - "Automation Database & Execution Helpers"
Cohesion: 0.10
Nodes (29): POST(), POST(), supabaseAdmin(), DispatchArgs, dispatchInboundToAiReply(), ARGS, h, AiConfigRow (+21 more)

### Community 8 - "Meta WhatsApp API Integration"
Cohesion: 0.06
Nodes (23): abort(), abortOnCannotGrowMemory(), addOnPostRun(), addOnPreRun(), addRunDependency(), assert(), callRuntimeCallbacks(), createWasm() (+15 more)

### Community 9 - "Broadcast & Funnel Analytics Pages"
Cohesion: 0.08
Nodes (39): GET(), ProfileRow, AgentsPage(), Tab, AutomationsPage(), FlowsPage(), Dashboard Shell, AiPlayground() (+31 more)

### Community 10 - "MCP Server & Client SDK"
Cohesion: 0.06
Nodes (39): NewRecipient, GET(), DeleteMessageTemplateArgs, downloadMedia(), DownloadMediaArgs, EditMessageTemplateArgs, EditMessageTemplateResult, getMediaUrl() (+31 more)

### Community 11 - "Opus Audio WebAssembly Encoder"
Cohesion: 0.07
Nodes (37): GET(), GET(), decideFallback(), FallbackAction, resolveFallbackPolicy(), POLICY_REPROMPT_2_HANDOFF, FAQ_BOT, FlowTemplate (+29 more)

### Community 12 - "API Routes & Rate Limiting"
Cohesion: 0.05
Nodes (42): author, bin, wacrm-mcp, dependencies, @modelcontextprotocol/sdk, zod, description, devDependencies (+34 more)

### Community 13 - "Contact Deduplication & Broadcast Core"
Cohesion: 0.13
Nodes (22): FAIL_COPY, JoinPage(), PeekFail, PeekOk, PeekResult, ROLE_LABEL, UsageResponse, WINDOWS (+14 more)

### Community 14 - "Deals Pipelines & Currency Formatters"
Cohesion: 0.12
Nodes (35): ConditionCfg, ConditionForm(), MEDIA_ACCEPT, NodeConfigFormProps, SendButtonsCfg, SendListCfg, SendMediaCfg, SetTagCfg (+27 more)

### Community 15 - "AI Knowledge Base & Account Auth"
Cohesion: 0.14
Nodes (16): Paginated, WacrmApiError, WacrmClient, Config, loadConfig(), truthy(), main(), registerBroadcastTools() (+8 more)

### Community 16 - "Core UI Components"
Cohesion: 0.09
Nodes (29): TEMPLATE_ICON, TEMPLATE_ORDER, ConversationItem(), ConversationItemProps, InboxFilter, STATUS_COLORS, ComposerMediaKind, MediaDraft (+21 more)

### Community 17 - "Project Dependencies & MCP Package Config"
Cohesion: 0.11
Nodes (25): RFC-4180, BroadcastDetailPage(), FunnelStep, RECIPIENT_STATUSES, StatCardProps, BroadcastsPage(), percent(), RateCell() (+17 more)

### Community 18 - "Team Settings & Member Invites"
Cohesion: 0.11
Nodes (23): ContactWithTags, ContactDetailViewProps, ContactFormProps, ADD_NODE_TYPES, NODE_TYPES, ContactSidebarProps, TemplateSendValues, ScrollArea() (+15 more)

### Community 19 - "Role-Based Access Control (RBAC)"
Cohesion: 0.12
Nodes (21): POST(), GET(), POST(), POST(), DELETE(), GET(), PUT(), PutBody (+13 more)

### Community 20 - "Module: appendResults()"
Cohesion: 0.11
Nodes (21): GET(), generateApiKey(), GeneratedApiKey, hashApiKey(), looksLikeApiKey(), timingSafeHexEqual(), ApiKeyRow, findActiveKeyByHash() (+13 more)

### Community 21 - "Module: LoginPage()"
Cohesion: 0.09
Nodes (30): DraftState, ExecuteArgs, interpolate(), resolveConversationId(), Account, AssignConversationStepConfig, Automation, AutomationLogStatus (+22 more)

### Community 22 - "Module: computeStageProbability()"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+22 more)

### Community 23 - "Module: inter"
Cohesion: 0.13
Nodes (24): inter, metadata, viewport, ModeToggle(), AppearancePanel(), ModeCard(), ThemeCard(), noopSubscribe() (+16 more)

### Community 24 - "Module: resolveAccountId()"
Cohesion: 0.16
Nodes (20): chunkText(), aiRequestTimeoutMs(), EmbeddingResponse, embedTexts(), toVectorLiteral(), MatchRow, AnthropicResponse, generateAnthropic() (+12 more)

### Community 25 - "Module: ConversationItem()"
Cohesion: 0.14
Nodes (24): GET(), DELETE(), GET(), PATCH(), requireUser(), supabaseAdmin(), appendResults(), AutomationContext (+16 more)

### Community 26 - "Module: BarChartEventProps"
Cohesion: 0.21
Nodes (23): BroadcastResult, POST(), findOrCreateContact(), sendViaMeta(), engineSendMedia(), engineSendText(), sendInteractiveViaMeta(), BroadcastError (+15 more)

### Community 27 - "Module: POST()"
Cohesion: 0.16
Nodes (18): ApiContact, ContactInput, RawTagJoin, dedupeByPhone(), ExistingContact, findExistingContact(), isExactMatch(), isUniqueViolation() (+10 more)

### Community 28 - "Module: engineSendInteractive()"
Cohesion: 0.08
Nodes (25): clsx, @dagrejs/dagre, date-fns, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, next, dependencies (+17 more)

### Community 29 - "Module: FlowCanvas()"
Cohesion: 0.14
Nodes (18): GET(), ConversationList(), ConversationListProps, MessageActionsProps, RealtimeEvent, UseRealtimeOptions, ApiConversation, ApiMessage (+10 more)

### Community 30 - "Module: ContactOutcome"
Cohesion: 0.11
Nodes (21): NewBroadcastPage(), steps, AudienceConfig, AudienceType, CustomFieldFilter, CustomFieldOperator, Step2Props, Step2SelectAudience() (+13 more)

### Community 31 - "Module: fetchAccountMembers()"
Cohesion: 0.17
Nodes (18): DealCard(), DealCardProps, formatDate(), initials(), DealFormProps, computeStageProbability(), PipelineAnalytics(), PipelineAnalyticsProps (+10 more)

### Community 32 - "Module: AiPlayground()"
Cohesion: 0.11
Nodes (21): BarChartEventProps, BarChartProps, BaseEventProps, ChartTooltip(), ChartTooltipProps, deepEqual(), HasScrollProps, Legend (+13 more)

### Community 33 - "Module: usePresence()"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+15 more)

### Community 34 - "Module: dependencies"
Cohesion: 0.22
Nodes (15): GET(), sanitizeSearch(), GET(), GET(), ContactError, serializeContact(), serializeMessage(), buildPage() (+7 more)

### Community 35 - "Module: AutomationBuilder()"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Module: SendInteractiveArgs"
Cohesion: 0.19
Nodes (14): supabaseAdmin(), POST(), GET(), addMinutesToTime(), BookingInput, createAppointment(), rescheduleAppointment(), toUTCISOString() (+6 more)

### Community 37 - "Module: aliases"
Cohesion: 0.34
Nodes (17): GET(), POST(), GET(), PATCH(), POST(), POST(), DELETE(), GET() (+9 more)

### Community 38 - "Module: POST()"
Cohesion: 0.13
Nodes (19): categoryColors, Step1ChooseTemplate(), Step1Props, Step4Props, TemplatePickerProps, TemplateFormData, BroadcastPlan, makeDb() (+11 more)

### Community 39 - "Module: findActiveKeyByHash()"
Cohesion: 0.16
Nodes (14): RFC-1918, deliverOne(), dispatchWebhookEvent(), EndpointRow, recordFailure(), Calls, makeDb(), Row (+6 more)

### Community 40 - "Module: ADD_NODE_TYPES"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir (+12 more)

### Community 41 - "Module: ButtonsEditor()"
Cohesion: 0.21
Nodes (16): getBaseUrl(), isHostAllowed(), parseAllowedHosts(), POST(), IMPORTANT: the plaintext token is returned exactly ONCE — in, GET(), getClientIp(), getClientIp() (+8 more)

### Community 42 - "Module: DELETE()"
Cohesion: 0.19
Nodes (13): DELETE(), GET(), POST(), resolveAccountId(), supabaseAdmin(), GET(), encrypt(), isLegacyFormat() (+5 more)

### Community 43 - "Module: ContactFilters"
Cohesion: 0.20
Nodes (20): ContactOutcome, ContactRow, findOrCreateContact(), findOrCreateConversation(), flagBroadcastReplyIfAny(), GET(), handleReaction(), handleStatusUpdate() (+12 more)

### Community 44 - "Module: compilerOptions"
Cohesion: 0.14
Nodes (15): ContactsPage(), ContactDetailView(), ContactForm(), CustomFieldsManager(), ImportModal(), ImportModalProps, PreviewCell(), truncateFilename() (+7 more)

### Community 45 - "Module: AddNodeButton()"
Cohesion: 0.15
Nodes (18): runStep(), engineSendInteractive(), engineSendTemplate(), engineSendText(), SendInput, SendTemplateArgs, SendTextArgs, engineSendInteractiveButtons() (+10 more)

### Community 46 - "Module: NextNodeRow()"
Cohesion: 0.16
Nodes (17): nonEmpty(), StepLike, validateOne(), ValidationIssue, walk(), fail(), InteractiveButton, InteractiveButtonsPayload (+9 more)

### Community 47 - "Module: clampExpiryDays()"
Cohesion: 0.16
Nodes (13): MessageComposerProps, SendInteractiveArgs, InteractiveMessagePayload, ContactRow, from(), Script, MEDIA_KINDS, SendMessageError (+5 more)

### Community 48 - "Module: ComposerMediaKind"
Cohesion: 0.36
Nodes (12): GET(), UsageRow, daysAgoStart(), DOW_SHORT_MON_FIRST, lastNDayKeys(), localDayKey(), mondayIndex(), startOfLocalDay() (+4 more)

### Community 49 - "Module: deliverOne()"
Cohesion: 0.27
Nodes (11): GET(), POST(), ApiWebhookEndpoint, generateWebhookSecret(), normalizeWebhookUrl(), serializeWebhookEndpoint(), isWebhookEvent(), normalizeEvents() (+3 more)

### Community 50 - "Module: compilerOptions"
Cohesion: 0.22
Nodes (14): expandFromSeeds(), NewAutomationPage(), SeedRow, uid(), BuilderStep, DispatchInput, AUTOMATION_TEMPLATES, AutomationTemplateDefinition (+6 more)

### Community 51 - "Module: generateApiKey()"
Cohesion: 0.18
Nodes (10): Adding a New AI Provider, bad(), POST(), POST(), KEY_PLACEHOLDER, PROVIDER_LABEL, AI_PROVIDER_DEFAULT_MODEL, AiProvider (+2 more)

### Community 52 - "Module: GET()"
Cohesion: 0.17
Nodes (13): ActivityFeed(), ActivityFeedProps, KIND_THEME, KindTheme, PAGE_SIZES, PageSize, relativeTime(), ActivityItem (+5 more)

### Community 53 - "Module: collectVariableSlots()"
Cohesion: 0.33
Nodes (13): assertContiguous(), countButtonsByType(), extractVariableIndices(), HeaderValidationResult, TEMPLATE_LIMITS, baseValid, validateBody(), validateButtons() (+5 more)

### Community 54 - "Module: author"
Cohesion: 0.20
Nodes (11): DashboardPage(), deltaLabel(), RangeDays, DeltaRow(), MetricCard(), MetricCardProps, Action, ACTIONS (+3 more)

### Community 55 - "Module: MediaImage()"
Cohesion: 0.20
Nodes (10): CATEGORIES, categoryColors, COMMON_LANGUAGE_CODES, emptyForm, HEADER_FORMATS, HeaderFormat, buildMediaPath(), MEDIA_MAX_BYTES_BY_KIND (+2 more)

### Community 56 - "Module: PresenceMap"
Cohesion: 0.18
Nodes (13): MCP Documentation, Public REST API Documentation, Hostinger Deploy Screenshot, MCP Server README, wacrm README, AI Reply Assistant, No-code Automations, Broadcasts & Templates (+5 more)

### Community 57 - "Module: MCP Documentation"
Cohesion: 0.27
Nodes (10): AiUsageCard(), arcPath(), Donut(), PipelineDonut(), PipelineDonutProps, CURRENCIES, CurrencyOption, formatCompactNumber() (+2 more)

### Community 58 - "Module: findOrCreateConversation()"
Cohesion: 0.18
Nodes (7): sleep(), executeAutomation(), runAutomationsForTrigger(), builder(), h, resolve(), triggerMatches()

### Community 59 - "Module: ExecuteArgs"
Cohesion: 0.23
Nodes (10): handleComponentsUpdate(), handleQualityUpdate(), handleStatusUpdate(), handleTemplateWebhookChange(), isTemplateWebhookField(), TEMPLATE_WEBHOOK_FIELDS, TemplateComponentsUpdateValue, TemplateQualityUpdateValue (+2 more)

### Community 60 - "Community 60"
Cohesion: 0.17
Nodes (11): author, bugs, url, description, engines, node, homepage, license (+3 more)

### Community 61 - "Module: devDependencies"
Cohesion: 0.24
Nodes (9): findOrCreateConversation(), POST(), SendSupabase, CONTACT, conversationInserts, messageInserts, postContactTemplate(), { sendTemplateMessage } (+1 more)

### Community 62 - "Module: TemplateFormData"
Cohesion: 0.26
Nodes (10): buildBodyComponent(), buildButtonPayload(), buildButtonsComponent(), buildFooterComponent(), buildHeaderComponent(), buildMetaTemplatePayload(), CATEGORY_TO_META, MetaButtonPayload (+2 more)

### Community 63 - "Module: buildBodyComponent()"
Cohesion: 0.24
Nodes (9): AutomationLogsPage(), StatusBadge(), StepRow(), AutomationCard(), formatRelative(), TRIGGER_META, triggerMeta, AutomationLog (+1 more)

### Community 64 - "Module: handleComponentsUpdate()"
Cohesion: 0.25
Nodes (9): ConversationsChart(), ConversationsChartProps, LineSvg(), longDayLabel(), niceCeil(), PADDING, RangeDays, shortDayLabel() (+1 more)

### Community 65 - "Community 65"
Cohesion: 0.18
Nodes (8): AudienceConfig, BroadcastApiResult, BroadcastPayload, CustomFieldFilter, CustomFieldOperator, CustomValueIndex, UseBroadcastSendingReturn, VariableMapping

### Community 66 - "Module: applyEdgeConnection()"
Cohesion: 0.20
Nodes (9): description, name, packages, repository, source, subfolder, url, $schema (+1 more)

### Community 67 - "Module: FlowInput"
Cohesion: 0.20
Nodes (10): crm, whatsapp, keywords, automation, broadcast, nextjs, self-hosted, supabase (+2 more)

### Community 68 - "Module: MessageActions()"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, start, test (+2 more)

### Community 69 - "Module: calls"
Cohesion: 0.33
Nodes (6): DELETE(), EDITABLE_STATUSES, isDryRun(), PATCH(), deleteMessageTemplate(), editMessageTemplate()

### Community 70 - "Module: FlowBuilder()"
Cohesion: 0.29
Nodes (9): extractSampleValues(), MetaButton, MetaTemplate, MetaTemplateComponent, normalizeCategory(), normalizeQualityScore(), parseButtons(), POST() (+1 more)

### Community 71 - "Module: EDITABLE_STATUSES"
Cohesion: 0.31
Nodes (5): calls, uploadResumableMedia(), ALLOWED_IMAGE_TYPES, ensureImageHeaderHandle(), TemplatePayload

### Community 72 - "Module: description"
Cohesion: 0.22
Nodes (9): message_templates table, profiles table, MembersTab, ProfileForm, QuickRepliesManager, SettingsOverview, SettingsPanelHead, TemplateManager (+1 more)

### Community 73 - "Module: scripts"
Cohesion: 0.39
Nodes (6): buildUpsertRow(), POST(), upsertTemplateRow(), submitMessageTemplate(), ALLOWED, normalizeStatus()

### Community 74 - "Community 74"
Cohesion: 0.39
Nodes (5): Appointment, Provider, Service, useBooking(), BookingDashboard()

### Community 75 - "Module: autoLayout()"
Cohesion: 0.25
Nodes (7): EVENT_COLOR, EventLine(), EventRow, RunCard(), RunRow, STATUS_META, summarizePayload()

### Community 76 - "Module: EVENT_COLOR"
Cohesion: 0.36
Nodes (6): EmptyState(), fmt(), ResponseTimeChart(), ResponseTimeChartProps, BarChart, ResponseTimeSummary

### Community 77 - "Module: buildUpsertRow()"
Cohesion: 0.46
Nodes (6): API_SCOPES, ApiScope, hasScope(), isApiScope(), normalizeScopes(), SCOPE_DESCRIPTIONS

### Community 78 - "Community 78"
Cohesion: 0.29
Nodes (7): overrides, @babel/core, fast-uri, hono, ip-address, js-yaml, postcss

### Community 79 - "Community 79"
Cohesion: 0.48
Nodes (5): parseContactCsv(), ParseContactCsvResult, parseCsvLine(), ParsedContactRow, parseTagCell()

### Community 80 - "Module: parseContactCsv()"
Cohesion: 0.40
Nodes (5): react, react, ChartLegend(), ScrollButton(), useOnWindowResize()

### Community 81 - "Module: overrides"
Cohesion: 0.33
Nodes (6): Account Invitations Table, Accounts Table, remove_account_member, transfer_account_ownership, peek_invitation, redeem_invitation

### Community 82 - "Module: BuilderCall"
Cohesion: 0.40
Nodes (5): Flow Nodes Table, Flow Run Events Table, Flow Runs Table, Flows Table, increment_flow_execution_count

### Community 83 - "Module: nextConfig"
Cohesion: 0.50
Nodes (3): maintainers, $schema, ArnasDon

### Community 84 - "Module: Icon()"
Cohesion: 0.50
Nodes (3): nextConfig, SECURITY_HEADERS, withNextIntl

### Community 87 - "Module: maintainers"
Cohesion: 0.50
Nodes (3): templateStatusConfig, TemplateStatusDisplay, MessageTemplateStatus

### Community 89 - "Module: refreshedCookies"
Cohesion: 0.50
Nodes (4): AI Knowledge Chunks Table, AI Knowledge Documents Table, match_ai_knowledge_fts, match_ai_knowledge_semantic

### Community 90 - "Module: Recorder"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 94 - "Module: config"
Cohesion: 0.67
Nodes (3): PasswordForm, SecurityPanel, SessionsCard

### Community 97 - "Module: Code of Conduct"
Cohesion: 0.67
Nodes (3): Profiles Table (Beta Features), is_account_member, set_member_role

## Knowledge Gaps
- **579 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+574 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **58 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Authentication & Shell Layouts` to `AI Auto-Reply & Knowledge Base`, `Dashboard Charts & Activity Feed`, `Flow Execution Engine`, `No-Code Automation Builder`, `Broadcast & Funnel Analytics Pages`, `Contact Deduplication & Broadcast Core`, `Core UI Components`, `Project Dependencies & MCP Package Config`, `Team Settings & Member Invites`, `Module: inter`, `Module: FlowCanvas()`, `Module: fetchAccountMembers()`, `Module: AiPlayground()`, `Module: compilerOptions`, `Module: GET()`, `Module: author`, `Module: buildBodyComponent()`, `Module: handleComponentsUpdate()`, `Module: autoLayout()`, `Module: EVENT_COLOR`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Module: engineSendInteractive()` to `Module: Pull Request Template`, `Module: Security Policy`, `Module: Bug Report Template`, `Module: Feature Request Template`, `Module: File SVG Icon`, `Module: Globe SVG Icon`, `Module: Inbox Doodle SVG Image`, `Module: Next.js SVG Icon`, `Module: Vercel SVG Icon`, `Module: parseContactCsv()`, `Community 60`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `react` connect `Module: parseContactCsv()` to `Module: engineSendInteractive()`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _579 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AI Auto-Reply & Knowledge Base` be split into smaller, more focused modules?**
  _Cohesion score 0.050187265917602995 - nodes in this community are weakly interconnected._
- **Should `Dashboard Charts & Activity Feed` be split into smaller, more focused modules?**
  _Cohesion score 0.0869215291750503 - nodes in this community are weakly interconnected._
- **Should `Flow Execution Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.05010351966873706 - nodes in this community are weakly interconnected._