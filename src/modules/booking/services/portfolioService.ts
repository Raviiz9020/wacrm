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
