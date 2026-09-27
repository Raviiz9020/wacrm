-- ============================================================
-- 043_inbound_media_mirror (renumbered from upstream 039)
--
-- Inbound media was never persisted. The webhook verified
-- the Meta media id and stored a POINTER — `/api/whatsapp/media/<id>`
-- — and that route re-streamed from Meta on every view. Meta
-- deletes media roughly 30 days after receipt, so every inbound photo,
-- voice note and document silently rots into "Photo unavailable".
--
-- Outbound media already survives: the composer uploads to the public
-- `chat-media` bucket (migration 023) and stores a durable URL. This
-- migration is the schema half of doing the same for inbound.
--
-- Three changes:
--
--   1. `messages.media_type` — the MIME type the webhook has always
--      had in hand and always discarded.
--
--   2. `whatsapp_config.mirror_inbound_media` — the per-account
--      opt-OUT. Defaults to TRUE so an account that never finds the
--      setting keeps its attachments.
--
--   3. Widens the `chat-media` MIME allow-list with the types Meta can
--      hand us on the way IN but that we never send out — animated
--      GIFs, bare Opus, QuickTime video, and Meta's own `video/3gp`
--      spelling of `video/3gpp`.
--
-- Idempotent — safe to re-run.
-- ============================================================

-- ============================================================
-- 1. messages.media_type
-- ============================================================
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS media_type TEXT;

COMMENT ON COLUMN messages.media_type IS
  'MIME type of media_url''s content, as reported by Meta. Populated for '
  'INBOUND media only: an outbound media_url is a chat-media object whose '
  'path already carries the original filename and extension, so the type '
  'adds nothing there. Also NULL for text messages and for every row '
  'written before migration 043.';

-- ============================================================
-- 2. whatsapp_config.mirror_inbound_media
-- ============================================================
ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS mirror_inbound_media BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN whatsapp_config.mirror_inbound_media IS
  'When true (default), the inbound webhook copies received media into '
  'the chat-media bucket so it outlives Meta''s ~30-day retention. Turn '
  'off to keep storage flat and accept that attachments expire.';

-- ============================================================
-- 3. chat-media: allow the inbound-only MIME types
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  TRUE,
  16777216, -- 16 MB, unchanged from 023
  ARRAY[
    -- Images
    'image/png', 'image/jpeg', 'image/webp',
    -- Inbound-only: animated GIFs forwarded from another chat
    'image/gif',
    -- Videos
    'video/mp4', 'video/3gpp',
    -- Inbound-only: Meta's own spelling of 3gpp, and iOS clips that
    -- arrive as QuickTime rather than MP4
    'video/3gp', 'video/quicktime',
    -- Documents
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    -- Audio (voice notes) — outbound is transcoded to audio/ogg first
    'audio/ogg',
    'audio/mpeg',
    'audio/aac',
    'audio/mp4',
    'audio/amr',
    -- Inbound-only: some clients label an Opus voice note audio/opus
    -- rather than audio/ogg
    'audio/opus'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
