# Graph Report - .  (2026-07-14)

## Corpus Check
- 442 files · ~296,506 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2209 nodes · 6280 edges · 146 communities (92 shown, 54 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.72)
- Token cost: 328,405 input · 12,953 output

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
- Community 110
- Community 111
- Community 112
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
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 145

## God Nodes (most connected - your core abstractions)
1. `cn()` - 203 edges
2. `createClient()` - 90 edges
3. `useAuth()` - 75 edges
4. `toErrorResponse()` - 70 edges
5. `requireRole()` - 64 edges
6. `Button()` - 53 edges
7. `createClient()` - 53 edges
8. `checkRateLimit()` - 48 edges
9. `rateLimitResponse()` - 43 edges
10. `decrypt()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `ScrollButton()` --references--> `react`  [EXTRACTED]
  src/components/tremor/bar-chart.tsx → package.json
- `TagManager()` --indirect_call--> `tag()`  [INFERRED]
  src/components/settings/tag-manager.tsx → src/lib/inbox/conversations.test.ts
- `wacrm README` --references--> `Hostinger Deploy Screenshot`  [EXTRACTED]
  /Users/ravipatil/Documents/WaCRM/wacrm/README.md → /Users/ravipatil/Documents/WaCRM/wacrm/.github/assets/hostinger-deploy.png
- `ProfileForm` --references--> `profiles table`  [INFERRED]
  src/components/settings/profile-form.tsx → supabase/migrations/001_initial_schema.sql
- `TagManager` --references--> `tags table`  [INFERRED]
  src/components/settings/tag-manager.tsx → supabase/migrations/001_initial_schema.sql

## Import Cycles
- 3-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 4-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-components.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 4-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-send-builder.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 5-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-components.ts -> src/lib/whatsapp/template-validators.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`
- 5-file cycle: `src/lib/whatsapp/interactive.ts -> src/lib/whatsapp/meta-api.ts -> src/lib/whatsapp/template-send-builder.ts -> src/lib/whatsapp/template-validators.ts -> src/types/index.ts -> src/lib/whatsapp/interactive.ts`

## Hyperedges (group relationships)
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

## Communities (146 total, 54 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (62): GET(), UsageRow, DashboardPage(), deltaLabel(), RangeDays, ActivityFeed(), ActivityFeedProps, KIND_THEME (+54 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (59): Query: requireRole and auth checks design, Tab, StatusBadge(), StepRow(), AiPlayground(), Turn, ContactDetailViewProps, PreviewCell() (+51 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (51): TEMPLATE_ICON, TEMPLATE_ORDER, ContactWithTags, describeTrigger(), FlowCard(), FlowRow, STATUS_COLORS, STATUS_LABELS() (+43 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (51): RFC-6585, DELETE(), GET(), POST(), IMPORTANT: the plaintext key is returned exactly ONCE, in the POST, DELETE(), GET(), DELETE() (+43 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (59): GET(), AdminClient, advanceCurrentNodeKey(), advanceFromNodeKey(), dispatchInboundToFlows(), endRun(), evaluateConditionNode(), evaluateConditionPredicate() (+51 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (48): English Translations, ForgotPasswordPage(), LoginPageInner(), SignupPageInner(), AgentsPage(), NewBroadcastPage(), steps, ContactsPage() (+40 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (46): BroadcastResult, POST(), findOrCreateContact(), runStep(), engineSendInteractive(), engineSendTemplate(), engineSendText(), SendInput (+38 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (41): RFC-4180, GET(), ProfileRow, AutomationsPage(), BroadcastDetailPage(), FunnelStep, RECIPIENT_STATUSES, StatCardProps (+33 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (42): buildUpsertRow(), POST(), upsertTemplateRow(), TemplateFormData, calls, submitMessageTemplate(), uploadResumableMedia(), buildBodyComponent() (+34 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (23): abort(), abortOnCannotGrowMemory(), addOnPostRun(), addOnPreRun(), addRunDependency(), assert(), callRuntimeCallbacks(), createWasm() (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (39): Query: Automations engine architecture, ADDABLE_STEPS, AgentSelect(), ApiStep, asInteractive(), AutomationResources, blankConfig(), BranchColumn() (+31 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (43): author, bin, wacrm-mcp, dependencies, @modelcontextprotocol/sdk, zod, description, devDependencies (+35 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (38): NewRecipient, GET(), DeleteMessageTemplateArgs, downloadMedia(), DownloadMediaArgs, EditMessageTemplateArgs, EditMessageTemplateResult, getMediaUrl() (+30 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (41): DraftState, appendResults(), evaluateCondition(), ExecuteArgs, executeStepsFrom(), finalizeLog(), interpolate(), resolveConversationId() (+33 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (24): ARGS, h, aiRequestTimeoutMs(), EmbeddingResponse, embedTexts(), GenerateArgs, parseGeneration(), AnthropicResponse (+16 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (22): POST(), POST(), supabaseAdmin(), DispatchArgs, dispatchInboundToAiReply(), AiConfigRow, loadAiConfig(), ROW (+14 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (16): Paginated, WacrmApiError, WacrmClient, Config, loadConfig(), truthy(), main(), registerBroadcastTools() (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.16
Nodes (20): AiUsageCard(), UsageResponse, WINDOWS, DocSummary, EditTarget, EDITABLE_ROLES, Invitation, PasswordForm() (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (28): GET(), POST(), DELETE(), GET(), PATCH(), requireUser(), GET(), POST() (+20 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (21): GET(), GET(), DELETE(), GET(), POST(), resolveAccountId(), supabaseAdmin(), GET() (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (22): GET(), generateApiKey(), GeneratedApiKey, hashApiKey(), looksLikeApiKey(), timingSafeHexEqual(), ApiKeyRow, findActiveKeyByHash() (+14 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+22 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (24): inter, metadata, viewport, ModeToggle(), AppearancePanel(), ModeCard(), ThemeCard(), noopSubscribe() (+16 more)

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (23): ContactOutcome, ContactRow, findOrCreateContact(), findOrCreateConversation(), flagBroadcastReplyIfAny(), GET(), handleReaction(), handleStatusUpdate() (+15 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (23): SettingsPage(), CustomFieldsSettings(), DealsSettings(), FieldsAndTagsPanel(), ROLE_META, SecurityPanel(), ChipVariant, SettingsChip() (+15 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (22): ContactDetailView(), DealCard(), DealCardProps, formatDate(), initials(), DealFormProps, computeStageProbability(), PipelineAnalytics() (+14 more)

### Community 26 - "Community 26"
Cohesion: 0.16
Nodes (22): FlowBuilder(), FlowCanvas(), FlowEditorShell(), LEGEND_TYPES, Props, useMatchMedia(), View, applyNodePositions() (+14 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (20): GET(), ConversationItem(), ConversationItemProps, ConversationList(), ConversationListProps, InboxFilter, STATUS_COLORS, DropdownMenuCheckboxItem() (+12 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (21): extractSampleValues(), MetaButton, MetaTemplate, MetaTemplateComponent, normalizeCategory(), normalizeQualityScore(), parseButtons(), POST() (+13 more)

### Community 29 - "Community 29"
Cohesion: 0.14
Nodes (22): ADD_NODE_TYPES, FlowCanvasInner(), FlowNodeCard(), NODE_TYPES, NodeEditSheet(), slotColor(), nodeColors, applyEdgeConnection() (+14 more)

### Community 30 - "Community 30"
Cohesion: 0.13
Nodes (20): dedupeByPhone(), ExistingContact, findExistingContact(), isExactMatch(), isUniqueViolation(), normalizeKey(), normalizePhone(), phonesMatch() (+12 more)

### Community 31 - "Community 31"
Cohesion: 0.08
Nodes (25): class-variance-authority, clsx, @dagrejs/dagre, date-fns, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, dependencies (+17 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (21): BarChartEventProps, BarChartProps, BaseEventProps, ChartTooltip(), ChartTooltipProps, deepEqual(), HasScrollProps, Legend (+13 more)

### Community 33 - "Community 33"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, tailwindcss (+15 more)

### Community 34 - "Community 34"
Cohesion: 0.28
Nodes (16): GET(), POST(), GET(), POST(), DELETE(), GET(), PATCH(), GET() (+8 more)

### Community 35 - "Community 35"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Community 36"
Cohesion: 0.10
Nodes (20): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir (+12 more)

### Community 37 - "Community 37"
Cohesion: 0.21
Nodes (16): getBaseUrl(), isHostAllowed(), parseAllowedHosts(), POST(), IMPORTANT: the plaintext token is returned exactly ONCE — in, GET(), getClientIp(), getClientIp() (+8 more)

### Community 38 - "Community 38"
Cohesion: 0.19
Nodes (15): PATCH(), POST(), sanitizeSearch(), ApiContact, ContactError, ContactInput, getContactById(), RawTagJoin (+7 more)

### Community 39 - "Community 39"
Cohesion: 0.17
Nodes (17): expandFromSeeds(), NewAutomationPage(), SeedRow, uid(), AutomationBuilder(), BuilderInitial, BuilderStep, ServerStepNode (+9 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (20): NodeConfigWithAdvanced(), NodeData, NextNodeRow(), NodeKeySelect(), TextRow(), ConditionCfg, ConditionForm(), MEDIA_ACCEPT (+12 more)

### Community 41 - "Community 41"
Cohesion: 0.16
Nodes (14): AddNodeButton(), NodeCard(), CanvasAddNodeButton(), groupNodeTypesByCategory(), NODE_CATEGORIES, NODE_HUE, NODE_META, NodeCategory (+6 more)

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (15): PRESENCE_DOT_CLASS, fmtDate(), fmtExpiresIn(), MembersTab(), PresenceMap, usePresence(), UsePresenceResult, derivePresence() (+7 more)

### Community 43 - "Community 43"
Cohesion: 0.20
Nodes (12): POST(), GET(), addMinutesToTime(), BookingInput, createAppointment(), rescheduleAppointment(), toUTCISOString(), formatDateFriendly() (+4 more)

### Community 44 - "Community 44"
Cohesion: 0.16
Nodes (16): MessageComposerProps, blankButtonsPayload(), blankListPayload(), ButtonsEditor(), InteractiveBuilder(), InteractiveBuilderProps, KindButton(), ListEditor() (+8 more)

### Community 45 - "Community 45"
Cohesion: 0.18
Nodes (16): QuickReplyPicker(), QuickReplyPickerProps, fail(), InteractiveButton, InteractiveButtonsPayload, InteractiveListPayload, InteractiveListRow, InteractiveListSection (+8 more)

### Community 46 - "Community 46"
Cohesion: 0.19
Nodes (11): RFC-1918, deliverOne(), EndpointRow, recordFailure(), Calls, Row, buildSignatureHeader(), body (+3 more)

### Community 47 - "Community 47"
Cohesion: 0.12
Nodes (14): categoryColors, Step1Props, Step4Props, TemplatePickerProps, AudienceConfig, BroadcastApiResult, BroadcastPayload, CustomFieldFilter (+6 more)

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (11): getPageTitleKey(), Header(), HeaderProps, pageTitles, DropdownMenu(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+3 more)

### Community 49 - "Community 49"
Cohesion: 0.15
Nodes (12): ApiKey, ApiKeysSettings(), fmtDate(), keyStatus(), CATEGORIES, categoryColors, COMMON_LANGUAGE_CODES, emptyForm (+4 more)

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (11): GET(), GET(), GET(), buildPage(), Cursor, decodeCursor(), encodeCursor(), keysetFilter() (+3 more)

### Community 51 - "Community 51"
Cohesion: 0.24
Nodes (14): MessageActions(), MessageBubble(), MessageComposer(), formatDateSeparator(), groupMessagesByDate(), MessageThread(), renderTemplateBody(), ReplyDraft (+6 more)

### Community 52 - "Community 52"
Cohesion: 0.21
Nodes (12): Query: Multi-tenant architecture and RLS, ConnectionStatus, ResetReason, Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Alert() (+4 more)

### Community 53 - "Community 53"
Cohesion: 0.18
Nodes (12): SendMediaForm(), ComposerMediaKind, formatDuration(), MediaDraft, MediaDraftPreview(), PICKER_ACCEPT, ReplyDraft, SendMediaPayload (+4 more)

### Community 54 - "Community 54"
Cohesion: 0.18
Nodes (13): MCP Documentation, Public REST API Documentation, Hostinger Deploy Screenshot, MCP Server README, wacrm README, AI Reply Assistant, No-code Automations, Broadcasts & Templates (+5 more)

### Community 55 - "Community 55"
Cohesion: 0.26
Nodes (10): POST(), FlowInput, NodeInput, outgoingEdges(), reachableFromEntry(), validFlow, validNodes, validateFlowForActivation() (+2 more)

### Community 56 - "Community 56"
Cohesion: 0.23
Nodes (10): findOrCreateConversation(), POST(), SendSupabase, CONTACT, conversationInserts, messageInserts, postContactTemplate(), { sendTemplateMessage } (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.18
Nodes (7): sleep(), executeAutomation(), runAutomationsForTrigger(), builder(), h, resolve(), triggerMatches()

### Community 58 - "Community 58"
Cohesion: 0.17
Nodes (11): author, bugs, url, description, engines, node, homepage, license (+3 more)

### Community 59 - "Community 59"
Cohesion: 0.27
Nodes (8): Booking Module Schema, Appointment, Provider, Service, useBooking(), TimeSlot, BookingDashboard(), Migration: Booking Module Init

### Community 60 - "Community 60"
Cohesion: 0.24
Nodes (6): MessageBubbleProps, groupReactions(), MessageReactions(), MessageReactionsProps, ReactionGroup, MessageReaction

### Community 61 - "Community 61"
Cohesion: 0.24
Nodes (10): contactFields, isMediaHeaderType(), isValidHttpUrl(), MEDIA_HEADER_TYPES, MediaHeaderType, SAMPLE_CONTACT, Step3Personalize(), Step3Props (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.27
Nodes (6): chunkText(), toVectorLiteral(), ingestDocument(), MatchRow, FakeState, h

### Community 63 - "Community 63"
Cohesion: 0.20
Nodes (9): description, name, packages, repository, source, subfolder, url, $schema (+1 more)

### Community 64 - "Community 64"
Cohesion: 0.20
Nodes (10): crm, whatsapp, keywords, automation, broadcast, nextjs, self-hosted, supabase (+2 more)

### Community 65 - "Community 65"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, start, test (+2 more)

### Community 66 - "Community 66"
Cohesion: 0.31
Nodes (8): InboxPage(), MessageActionsProps, MessageThreadProps, RealtimeEvent, useRealtime(), UseRealtimeOptions, ConversationStatus, Message

### Community 67 - "Community 67"
Cohesion: 0.22
Nodes (9): message_templates table, profiles table, MembersTab, ProfileForm, QuickRepliesManager, SettingsOverview, SettingsPanelHead, TemplateManager (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.31
Nodes (7): AutomationLogsPage(), AutomationCard(), formatRelative(), TRIGGER_META, triggerMeta, AutomationLog, AutomationLogStepResult

### Community 69 - "Community 69"
Cohesion: 0.25
Nodes (7): EVENT_COLOR, EventLine(), EventRow, RunCard(), RunRow, STATUS_META, summarizePayload()

### Community 70 - "Community 70"
Cohesion: 0.31
Nodes (7): QUICK_EMOJIS, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), PopoverTrigger()

### Community 71 - "Community 71"
Cohesion: 0.25
Nodes (8): RequireRoleProps, Member, AuthContextValue, Profile, AccountContext, AccountRole, AccountInvitation, Profile

### Community 72 - "Community 72"
Cohesion: 0.29
Nodes (6): AiAccountStatus, AiThreadBanner(), AiThreadBannerProps, Banner(), fetchAiAccountStatus(), statusCache

### Community 73 - "Community 73"
Cohesion: 0.46
Nodes (6): API_SCOPES, ApiScope, hasScope(), isApiScope(), normalizeScopes(), SCOPE_DESCRIPTIONS

### Community 74 - "Community 74"
Cohesion: 0.29
Nodes (7): overrides, @babel/core, fast-uri, hono, ip-address, js-yaml, postcss

### Community 75 - "Community 75"
Cohesion: 0.48
Nodes (5): parseContactCsv(), ParseContactCsvResult, parseCsvLine(), ParsedContactRow, parseTagCell()

### Community 76 - "Community 76"
Cohesion: 0.52
Nodes (5): isWebhookEvent(), normalizeEvents(), WEBHOOK_EVENT_DESCRIPTIONS, WEBHOOK_EVENTS, WebhookEvent

### Community 77 - "Community 77"
Cohesion: 0.40
Nodes (5): react, react, ChartLegend(), ScrollButton(), useOnWindowResize()

### Community 78 - "Community 78"
Cohesion: 0.53
Nodes (5): DELETE(), GET(), PUT(), PutBody, requireOwnership()

### Community 79 - "Community 79"
Cohesion: 0.33
Nodes (6): Account Invitations Table, Accounts Table, remove_account_member, transfer_account_ownership, peek_invitation, redeem_invitation

### Community 80 - "Community 80"
Cohesion: 0.70
Nodes (4): GET(), POST(), requireUser(), getFlowTemplate()

### Community 81 - "Community 81"
Cohesion: 0.70
Nodes (3): DELETE(), PATCH(), POST()

### Community 82 - "Community 82"
Cohesion: 0.40
Nodes (5): Flow Nodes Table, Flow Run Events Table, Flow Runs Table, Flows Table, increment_flow_execution_count

### Community 83 - "Community 83"
Cohesion: 0.50
Nodes (3): maintainers, $schema, ArnasDon

### Community 84 - "Community 84"
Cohesion: 0.50
Nodes (3): nextConfig, SECURITY_HEADERS, withNextIntl

### Community 87 - "Community 87"
Cohesion: 0.50
Nodes (4): AI Knowledge Chunks Table, AI Knowledge Documents Table, match_ai_knowledge_fts, match_ai_knowledge_semantic

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (3): PasswordForm, SecurityPanel, SessionsCard

### Community 95 - "Community 95"
Cohesion: 0.67
Nodes (3): Profiles Table (Beta Features), is_account_member, set_member_role

## Knowledge Gaps
- **568 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+563 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 0`, `Community 2`, `Community 5`, `Community 7`, `Community 10`, `Community 17`, `Community 22`, `Community 24`, `Community 25`, `Community 26`, `Community 27`, `Community 29`, `Community 32`, `Community 40`, `Community 41`, `Community 42`, `Community 44`, `Community 48`, `Community 49`, `Community 51`, `Community 52`, `Community 53`, `Community 60`, `Community 66`, `Community 68`, `Community 69`, `Community 70`, `Community 72`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 31` to `Community 97`, `Community 99`, `Community 101`, `Community 102`, `Community 103`, `Community 104`, `Community 105`, `Community 106`, `Community 107`, `Community 77`, `Community 58`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `react` connect `Community 77` to `Community 31`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _568 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05359831376091539 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.053554040895813046 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08373904576436222 - nodes in this community are weakly interconnected._