import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/flows/admin-client';
import type { PortfolioMedia } from '@/types';

function getSupabaseClient(customClient?: any) {
  if (customClient) return customClient;
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }
  return supabaseAdmin();
}

/**
 * Lists portfolio media items, optionally filtered by service category.
 */
export async function listPortfolioMedia(
  accountId: string,
  category?: string,
  passedClient?: any
): Promise<PortfolioMedia[]> {
  const client = getSupabaseClient(passedClient);
  let query = client
    .from('portfolio_media')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.ilike('category', category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list portfolio media: ${error.message}`);
  }

  return data || [];
}

/**
 * Adds a new portfolio media record.
 */
export async function addPortfolioMedia(
  input: {
    accountId: string;
    title: string;
    category: string;
    mediaUrl: string;
    mediaType?: 'image' | 'video';
    metadata?: Record<string, unknown>;
  },
  passedClient?: any
): Promise<PortfolioMedia> {
  const client = getSupabaseClient(passedClient);
  const { accountId, title, category, mediaUrl, mediaType = 'image', metadata = {} } = input;

  const { data, error } = await client
    .from('portfolio_media')
    .insert({
      account_id: accountId,
      title,
      category,
      media_url: mediaUrl,
      media_type: mediaType,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add portfolio media: ${error.message}`);
  }

  return data;
}

/**
 * Deletes a portfolio media record.
 */
export async function deletePortfolioMedia(
  accountId: string,
  mediaId: string,
  passedClient?: any
): Promise<boolean> {
  const client = getSupabaseClient(passedClient);
  const { error } = await client
    .from('portfolio_media')
    .delete()
    .eq('id', mediaId)
    .eq('account_id', accountId);

  if (error) {
    throw new Error(`Failed to delete portfolio media: ${error.message}`);
  }

  return true;
}

/**
 * Fetches portfolio media and formats it as a text context block for AI grounding.
 */
export async function fetchPortfolioMediaContext(
  db: any,
  accountId: string
): Promise<string> {
  if (!accountId || !db || typeof db.from !== 'function') return '';

  try {
    const query = db.from('portfolio_media');
    if (!query || typeof query.select !== 'function') return '';

    const select = query.select('title, category, media_url, media_type');
    if (!select || typeof select.eq !== 'function') return '';

    const eq1 = select.eq('account_id', accountId);
    if (!eq1 || typeof eq1.eq !== 'function') {
      const { data, error } = await eq1;
      if (error || !data || data.length === 0) return '';
      return formatLines(data);
    }

    const eq2 = eq1.eq('is_active', true);
    const { data, error } = await eq2;

    if (error) {
      console.error('Error fetching portfolio media for AI context:', error);
      return '';
    }
    if (!data || data.length === 0) return '';

    return formatLines(data);
  } catch (err) {
    console.error('Failed to format portfolio media context:', err);
    return '';
  }
}

function formatLines(data: any[]): string {
  const lines = data
    .map((item: any) => `- [Category: ${item.category}] "${item.title}" (${item.media_type}): ${item.media_url}`)
    .filter(Boolean);
  return `### Showcase Portfolio Gallery\nWe have the following before/after photos, showcase videos, and media items. If the user asks for examples, photos, before/after results, or visual proof, you can share these links directly with them:\n${lines.join('\n')}`;
}
