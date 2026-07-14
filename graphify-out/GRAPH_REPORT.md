# Graph Report - .  (2026-07-14)

## Corpus Check
- 11 files · ~1,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2213 nodes · 6146 edges · 151 communities (96 shown, 55 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.7)
- Token cost: 26,491 input · 1,131 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
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
1. `cn()` - 199 edges
2. `createClient()` - 90 edges
3. `useAuth()` - 73 edges
4. `toErrorResponse()` - 64 edges
5. `requireRole()` - 59 edges
6. `createClient()` - 53 edges
7. `Button()` - 51 edges
8. `checkRateLimit()` - 44 edges
9. `requireApiKey()` - 39 edges
10. `rateLimitResponse()` - 39 edges

## Surprising Connections (you probably didn't know these)
- `Adding a New AI Provider` --references--> `Migration: Add Gemini Provider`  [EXTRACTED]
  docs/add-ai-provider.md → supabase/migrations/040_add_gemini_provider.sql
- `Adding a New AI Provider` --references--> `AI_PROVIDER_DEFAULT_MODEL`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/defaults.ts
- `Adding a New AI Provider` --references--> `generateReply()`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/generate.ts
- `Adding a New AI Provider` --references--> `AiProvider`  [EXTRACTED]
  docs/add-ai-provider.md → src/lib/ai/types.ts
- `ScrollButton()` --references--> `react`  [EXTRACTED]
  src/components/tremor/bar-chart.tsx → package.json

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
- **Inbox Feature Set** — src_components_inbox_message_thread_messagethread, src_components_inbox_conversation_list_conversationlist, src_components_inbox_contact_sidebar_contactsidebar, src_components_inbox_message_composer_messagecomposer [INFERRED 0.90]
- **Pipeline Management** — src_components_pipelines_pipeline_board_pipelineboard, src_components_pipelines_deal_form_dealform, src_components_pipelines_pipeline_analytics_pipelineanalytics, src_components_pipelines_pipeline_settings_pipelinesettings [INFERRED 0.90]
- **Settings Redesign Components** — src_components_settings_settings_overview_settings_overview, src_components_settings_settings_rail_settings_rail, src_components_settings_settings_panel_head_settings_panel_head [INFERRED 0.80]
- **Authentication & Profile Management** — src_components_settings_profile_form_profile_form, src_components_settings_password_form_password_form, src_components_settings_sessions_card_sessions_card, src_hooks_use_auth_use_auth [EXTRACTED 0.90]
- **Multi-Tenant Account Sharing System** — supabase_migrations_017_account_sharing_accounts, supabase_migrations_017_account_sharing_account_invitations, supabase_migrations_017_account_sharing_is_account_member, supabase_migrations_018_account_member_rpcs_set_member_role, supabase_migrations_019_invitation_rpcs_redeem_invitation [EXTRACTED 1.00]
- **AI Reply Assistant & Knowledge Base** — supabase_migrations_029_ai_reply_ai_configs, supabase_migrations_030_ai_knowledge_ai_knowledge_documents, supabase_migrations_030_ai_knowledge_ai_knowledge_chunks, supabase_migrations_033_ai_reply_polish_ai_usage_log [EXTRACTED 1.00]
- **Conversational Flows Engine** — supabase_migrations_010_flows_flows, supabase_migrations_010_flows_flow_nodes, supabase_migrations_010_flows_flow_runs, supabase_migrations_010_flows_flow_run_events, supabase_migrations_016_flow_media_flow_media_bucket [EXTRACTED 1.00]

## Communities (151 total, 55 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (80): GET(), POST(), GET(), PATCH(), GET(), POST(), sanitizeSearch(), GET() (+72 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (62): Adding a New AI Provider, bad(), POST(), POST(), POST(), POST(), AiConfig(), KEY_PLACEHOLDER (+54 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (52): Query: Multi-tenant architecture and RLS, Tab, AiPlayground(), Turn, ContactDetailViewProps, PreviewCell(), EmptyState(), ADD_NODE_TYPES (+44 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (42): ContactWithTags, describeTrigger(), FlowCard(), FlowRow, STATUS_COLORS, STATUS_LABELS(), TEMPLATE_ICONS, TemplateSummary (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (23): abort(), abortOnCannotGrowMemory(), addOnPostRun(), addOnPreRun(), addRunDependency(), assert(), callRuntimeCallbacks(), createWasm() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (41): English Translations, ForgotPasswordPage(), LoginPageInner(), SignupPageInner(), DashboardShellInner(), NotificationsPage(), TYPE_ICON, PipelinesPage() (+33 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (36): BroadcastResult, POST(), findOrCreateContact(), engineSendInteractive(), SendInput, SendTemplateArgs, SendTextArgs, sendViaMeta() (+28 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (36): Query: Automations engine architecture, ADDABLE_STEPS, AgentSelect(), ApiStep, asInteractive(), blankConfig(), BranchColumn(), cid() (+28 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (37): NewBroadcastPage(), steps, AutomationResources, categoryColors, Step1ChooseTemplate(), Step1Props, AudienceConfig, AudienceType (+29 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (42): author, bin, wacrm-mcp, dependencies, @modelcontextprotocol/sdk, zod, description, devDependencies (+34 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (33): RFC-4180, BroadcastDetailPage(), FunnelStep, RECIPIENT_STATUSES, StatCardProps, BroadcastsPage(), DraftState, broadcastStatusConfig (+25 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (35): ConditionCfg, ConditionForm(), MEDIA_ACCEPT, NodeConfigFormProps, SendButtonsCfg, SendListCfg, SendMediaCfg, SetTagCfg (+27 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (34): NewRecipient, GET(), DeleteMessageTemplateArgs, downloadMedia(), DownloadMediaArgs, EditMessageTemplateArgs, EditMessageTemplateResult, getMediaUrl() (+26 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (16): Paginated, WacrmApiError, WacrmClient, Config, loadConfig(), truthy(), main(), registerBroadcastTools() (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (25): UsageResponse, WINDOWS, NodeKeySelect(), CreatedInvite, EXPIRY_OPTIONS, InviteMemberDialogProps, InviteRole, CATEGORIES (+17 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (25): AutomationCard(), TEMPLATE_ICON, TEMPLATE_ORDER, SPEC_DEFAULT_STAGES, ComposerMediaKind, MediaDraft, MediaDraftPreview(), PICKER_ACCEPT (+17 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (25): GET(), POST(), IMPORTANT: the plaintext key is returned exactly ONCE, in the POST, GET(), ProfileRow, GET(), PATCH(), DELETE() (+17 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (33): GET(), appendResults(), AutomationContext, evaluateCondition(), ExecuteArgs, executeAutomation(), executeStepsFrom(), finalizeLog() (+25 more)

### Community 18 - "Community 18"
Cohesion: 0.17
Nodes (18): DocSummary, EditTarget, EDITABLE_ROLES, Invitation, PasswordForm(), SecurityPanel(), SessionsCard(), SettingsPanelHead() (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (24): RFC-6585, DELETE(), DELETE(), DELETE(), PATCH(), rpcErrorToResponse(), looksLikeUuid(), POST() (+16 more)

### Community 20 - "Community 20"
Cohesion: 0.15
Nodes (25): DELETE(), GET(), PATCH(), requireUser(), GET(), POST(), DELETE(), PATCH() (+17 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+22 more)

### Community 22 - "Community 22"
Cohesion: 0.10
Nodes (28): FAQ_BOT, FlowTemplate, FlowTemplateNode, FlowTemplateNodeType, LEAD_CAPTURE, TEMPLATES, WELCOME_MENU, CollectInputNodeConfig (+20 more)

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (23): inter, metadata, viewport, AppearancePanel(), ModeCard(), ThemeCard(), noopSubscribe(), ThemedToaster() (+15 more)

### Community 24 - "Community 24"
Cohesion: 0.17
Nodes (19): POST(), POST(), DELETE(), GET(), PUT(), PutBody, requireOwnership(), GET() (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.16
Nodes (21): FlowBuilder(), FlowCanvas(), FlowEditorShell(), LEGEND_TYPES, Props, SegButton(), useMatchMedia(), View (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (21): InboxPage(), ConversationItem(), ConversationItemProps, ConversationList(), ConversationListProps, InboxFilter, STATUS_COLORS, MessageThreadProps (+13 more)

### Community 27 - "Community 27"
Cohesion: 0.14
Nodes (20): SettingsPage(), CustomFieldsSettings(), FieldsAndTagsPanel(), ROLE_META, ChipVariant, SettingsChip(), StatusDot(), VARIANTS (+12 more)

### Community 28 - "Community 28"
Cohesion: 0.13
Nodes (23): NodeConfigWithAdvanced(), slugify(), blankButtonsPayload(), blankListPayload(), ButtonsEditor(), InteractiveBuilder(), KindButton(), ListEditor() (+15 more)

### Community 29 - "Community 29"
Cohesion: 0.08
Nodes (25): class-variance-authority, clsx, @dagrejs/dagre, date-fns, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, dependencies (+17 more)

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (18): percent(), RateCell(), Switch(), Table(), TableBody(), TableCaption(), TableCell(), TableFooter() (+10 more)

### Community 31 - "Community 31"
Cohesion: 0.15
Nodes (21): MessageComposerProps, InteractiveBuilderProps, SendInteractiveArgs, InteractiveMessagePayload, interactivePayloadPreviewText(), sendInteractiveButtons(), sendInteractiveList(), sendMediaMessage() (+13 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (21): BarChartEventProps, BarChartProps, BaseEventProps, ChartTooltip(), ChartTooltipProps, deepEqual(), HasScrollProps, Legend (+13 more)

### Community 33 - "Community 33"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+15 more)

### Community 34 - "Community 34"
Cohesion: 0.18
Nodes (19): ContactOutcome, ContactRow, findOrCreateContact(), findOrCreateConversation(), flagBroadcastReplyIfAny(), handleReaction(), handleStatusUpdate(), isValidStatusTransition() (+11 more)

### Community 35 - "Community 35"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Community 36"
Cohesion: 0.19
Nodes (14): supabaseAdmin(), POST(), GET(), addMinutesToTime(), BookingInput, createAppointment(), rescheduleAppointment(), toUTCISOString() (+6 more)

### Community 37 - "Community 37"
Cohesion: 0.14
Nodes (18): FlowCanvasInner(), NodeData, BuilderNode, applyEdgeConnection(), CanvasEdge, deriveCanvasEdges(), OutgoingSlot, outgoingSlots() (+10 more)

### Community 38 - "Community 38"
Cohesion: 0.16
Nodes (14): RFC-1918, deliverOne(), dispatchWebhookEvent(), EndpointRow, recordFailure(), Calls, makeDb(), Row (+6 more)

### Community 39 - "Community 39"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir (+12 more)

### Community 40 - "Community 40"
Cohesion: 0.18
Nodes (13): DELETE(), GET(), POST(), resolveAccountId(), supabaseAdmin(), GET(), GET(), encrypt() (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.17
Nodes (17): expandFromSeeds(), NewAutomationPage(), SeedRow, uid(), AutomationBuilder(), BuilderInitial, BuilderStep, ServerStepNode (+9 more)

### Community 42 - "Community 42"
Cohesion: 0.16
Nodes (15): DealCardProps, DealFormProps, computeStageProbability(), PipelineAnalytics(), PipelineAnalyticsProps, PipelineBoard(), PipelineBoardProps, PipelineSettingsProps (+7 more)

### Community 43 - "Community 43"
Cohesion: 0.18
Nodes (15): PRESENCE_DOT_CLASS, fmtDate(), fmtExpiresIn(), MembersTab(), PresenceMap, usePresence(), UsePresenceResult, derivePresence() (+7 more)

### Community 44 - "Community 44"
Cohesion: 0.23
Nodes (15): GET(), getBaseUrl(), isHostAllowed(), parseAllowedHosts(), POST(), IMPORTANT: the plaintext token is returned exactly ONCE — in, getClientIp(), POST() (+7 more)

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (16): AgentsPage(), AutomationsPage(), ContactsPage(), FlowsPage(), CanAction, useCan(), ACCOUNT_ROLES, canDeleteAccount() (+8 more)

### Community 46 - "Community 46"
Cohesion: 0.19
Nodes (15): AiUsageCard(), arcPath(), Donut(), PipelineDonut(), PipelineDonutProps, DealCard(), formatDate(), initials() (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.16
Nodes (16): AddNodeButton(), NodeCard(), CanvasAddNodeButton(), FlowNodeCard(), NodeEditSheet(), slotColor(), groupNodeTypesByCategory(), NODE_CATEGORIES (+8 more)

### Community 48 - "Community 48"
Cohesion: 0.19
Nodes (17): MessageActions(), MessageBubble(), formatDuration(), MessageComposer(), SendMediaPayload, formatDateSeparator(), groupMessagesByDate(), MessageThread() (+9 more)

### Community 49 - "Community 49"
Cohesion: 0.23
Nodes (13): dedupeByPhone(), ExistingContact, findExistingContact(), isExactMatch(), isUniqueViolation(), normalizeKey(), normalizePhone(), phonesMatch() (+5 more)

### Community 50 - "Community 50"
Cohesion: 0.36
Nodes (12): GET(), UsageRow, daysAgoStart(), DOW_SHORT_MON_FIRST, lastNDayKeys(), localDayKey(), mondayIndex(), startOfLocalDay() (+4 more)

### Community 51 - "Community 51"
Cohesion: 0.17
Nodes (13): ActivityFeed(), ActivityFeedProps, KIND_THEME, KindTheme, PAGE_SIZES, PageSize, relativeTime(), ActivityItem (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.33
Nodes (13): assertContiguous(), countButtonsByType(), extractVariableIndices(), HeaderValidationResult, TEMPLATE_LIMITS, baseValid, validateBody(), validateButtons() (+5 more)

### Community 53 - "Community 53"
Cohesion: 0.20
Nodes (11): DashboardPage(), deltaLabel(), RangeDays, DeltaRow(), MetricCard(), MetricCardProps, Action, ACTIONS (+3 more)

### Community 54 - "Community 54"
Cohesion: 0.21
Nodes (7): MessageBubbleProps, groupReactions(), MessageReactions(), MessageReactionsProps, ReactionGroup, InteractivePreview(), MessageReaction

### Community 55 - "Community 55"
Cohesion: 0.18
Nodes (13): MCP Documentation, Public REST API Documentation, Hostinger Deploy Screenshot, MCP Server README, wacrm README, AI Reply Assistant, No-code Automations, Broadcasts & Templates (+5 more)

### Community 56 - "Community 56"
Cohesion: 0.23
Nodes (10): handleComponentsUpdate(), handleQualityUpdate(), handleStatusUpdate(), handleTemplateWebhookChange(), isTemplateWebhookField(), TEMPLATE_WEBHOOK_FIELDS, TemplateComponentsUpdateValue, TemplateQualityUpdateValue (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.17
Nodes (11): author, bugs, url, description, engines, node, homepage, license (+3 more)

### Community 58 - "Community 58"
Cohesion: 0.24
Nodes (9): findOrCreateConversation(), POST(), SendSupabase, CONTACT, conversationInserts, messageInserts, postContactTemplate(), { sendTemplateMessage } (+1 more)

### Community 59 - "Community 59"
Cohesion: 0.23
Nodes (11): extractSampleValues(), MetaButton, MetaTemplate, MetaTemplateComponent, normalizeCategory(), normalizeQualityScore(), parseButtons(), POST() (+3 more)

### Community 60 - "Community 60"
Cohesion: 0.17
Nodes (9): RequireRoleProps, Member, AuthContextValue, Profile, AccountContext, AccountRole, AccountInvitation, AccountMember (+1 more)

### Community 61 - "Community 61"
Cohesion: 0.24
Nodes (10): makeDb(), buildBodyComponent(), buildButtonComponent(), buildHeaderComponent(), buildSendComponents(), buttonNeedsSendParam(), MetaSendComponent, MetaSendParameter (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.26
Nodes (10): buildBodyComponent(), buildButtonPayload(), buildButtonsComponent(), buildFooterComponent(), buildHeaderComponent(), buildMetaTemplatePayload(), CATEGORY_TO_META, MetaButtonPayload (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.25
Nodes (9): ConversationsChart(), ConversationsChartProps, LineSvg(), longDayLabel(), niceCeil(), PADDING, RangeDays, shortDayLabel() (+1 more)

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (9): FlowInput, NodeInput, outgoingEdges(), reachableFromEntry(), validFlow, validNodes, validateFlowForActivation(), validateNode() (+1 more)

### Community 65 - "Community 65"
Cohesion: 0.20
Nodes (9): description, name, packages, repository, source, subfolder, url, $schema (+1 more)

### Community 66 - "Community 66"
Cohesion: 0.20
Nodes (10): crm, whatsapp, keywords, automation, broadcast, nextjs, self-hosted, supabase (+2 more)

### Community 67 - "Community 67"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, start, test (+2 more)

### Community 68 - "Community 68"
Cohesion: 0.33
Nodes (7): GET(), decideFallback(), FallbackAction, resolveFallbackPolicy(), POLICY_REPROMPT_2_HANDOFF, DEFAULT_FALLBACK_POLICY, FlowFallbackPolicy

### Community 69 - "Community 69"
Cohesion: 0.33
Nodes (6): DELETE(), EDITABLE_STATUSES, isDryRun(), PATCH(), deleteMessageTemplate(), editMessageTemplate()

### Community 70 - "Community 70"
Cohesion: 0.27
Nodes (8): MessageActionsProps, QUICK_EMOJIS, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), PopoverTrigger()

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (4): sleep(), builder(), h, resolve()

### Community 72 - "Community 72"
Cohesion: 0.31
Nodes (5): calls, uploadResumableMedia(), ALLOWED_IMAGE_TYPES, ensureImageHeaderHandle(), TemplatePayload

### Community 73 - "Community 73"
Cohesion: 0.22
Nodes (9): message_templates table, profiles table, MembersTab, ProfileForm, QuickRepliesManager, SettingsOverview, SettingsPanelHead, TemplateManager (+1 more)

### Community 74 - "Community 74"
Cohesion: 0.39
Nodes (6): buildUpsertRow(), POST(), upsertTemplateRow(), submitMessageTemplate(), ALLOWED, normalizeStatus()

### Community 75 - "Community 75"
Cohesion: 0.28
Nodes (7): AutomationLogsPage(), StatusBadge(), StepRow(), formatRelative(), TRIGGER_META, AutomationLog, AutomationLogStepResult

### Community 76 - "Community 76"
Cohesion: 0.25
Nodes (7): EVENT_COLOR, EventLine(), EventRow, RunCard(), RunRow, STATUS_META, summarizePayload()

### Community 77 - "Community 77"
Cohesion: 0.31
Nodes (7): fmt(), ResponseTimeChart(), ResponseTimeChartProps, Skeleton(), SkeletonCard(), BarChart, ResponseTimeSummary

### Community 78 - "Community 78"
Cohesion: 0.29
Nodes (6): AiAccountStatus, AiThreadBanner(), AiThreadBannerProps, Banner(), fetchAiAccountStatus(), statusCache

### Community 79 - "Community 79"
Cohesion: 0.25
Nodes (3): opus-recorder, Recorder, RecorderConfig

### Community 80 - "Community 80"
Cohesion: 0.29
Nodes (7): overrides, @babel/core, fast-uri, hono, ip-address, js-yaml, postcss

### Community 81 - "Community 81"
Cohesion: 0.48
Nodes (5): parseContactCsv(), ParseContactCsvResult, parseCsvLine(), ParsedContactRow, parseTagCell()

### Community 82 - "Community 82"
Cohesion: 0.40
Nodes (5): react, react, ChartLegend(), ScrollButton(), useOnWindowResize()

### Community 83 - "Community 83"
Cohesion: 0.53
Nodes (4): buildMediaPath(), MEDIA_MAX_BYTES_BY_KIND, uploadAccountMedia(), UploadAccountMediaResult

### Community 84 - "Community 84"
Cohesion: 0.33
Nodes (6): Account Invitations Table, Accounts Table, remove_account_member, transfer_account_ownership, peek_invitation, redeem_invitation

### Community 85 - "Community 85"
Cohesion: 0.60
Nodes (4): applyNodePositions(), defaultConfigFor(), FlowEditorProvider(), uniqueNodeKey()

### Community 86 - "Community 86"
Cohesion: 0.40
Nodes (5): Flow Nodes Table, Flow Run Events Table, Flow Runs Table, Flows Table, increment_flow_execution_count

### Community 87 - "Community 87"
Cohesion: 0.50
Nodes (3): maintainers, $schema, ArnasDon

### Community 88 - "Community 88"
Cohesion: 0.50
Nodes (3): nextConfig, SECURITY_HEADERS, withNextIntl

### Community 91 - "Community 91"
Cohesion: 0.50
Nodes (4): AI Knowledge Chunks Table, AI Knowledge Documents Table, match_ai_knowledge_fts, match_ai_knowledge_semantic

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 96 - "Community 96"
Cohesion: 0.67
Nodes (3): PasswordForm, SecurityPanel, SessionsCard

### Community 99 - "Community 99"
Cohesion: 0.67
Nodes (3): Profiles Table (Beta Features), is_account_member, set_member_role

## Knowledge Gaps
- **576 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+571 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 3`, `Community 5`, `Community 7`, `Community 14`, `Community 15`, `Community 18`, `Community 23`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 30`, `Community 32`, `Community 42`, `Community 43`, `Community 47`, `Community 48`, `Community 51`, `Community 53`, `Community 54`, `Community 63`, `Community 70`, `Community 75`, `Community 76`, `Community 77`, `Community 78`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 29` to `Community 101`, `Community 103`, `Community 105`, `Community 106`, `Community 107`, `Community 108`, `Community 109`, `Community 110`, `Community 111`, `Community 82`, `Community 57`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `react` connect `Community 82` to `Community 29`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _576 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05442278860569715 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05226722049151956 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.060764587525150904 - nodes in this community are weakly interconnected._