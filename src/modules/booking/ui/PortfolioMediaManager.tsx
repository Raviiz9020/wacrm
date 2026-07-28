"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, Trash2, Tag, UploadCloud, Film } from "lucide-react";
import { listPortfolioMedia, addPortfolioMedia, deletePortfolioMedia } from "../services/portfolioService";
import type { PortfolioMedia } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface PortfolioMediaManagerProps {
  accountId: string;
}

export function PortfolioMediaManager({ accountId }: PortfolioMediaManagerProps) {
  const [items, setItems] = useState<PortfolioMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const supabase = createClient();

  const loadMedia = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await listPortfolioMedia(accountId);
      setItems(data);
    } catch (err) {
      console.error("Failed to load portfolio media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [accountId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !category.trim()) return;

    setUploading(true);
    try {
      // 1. Upload file to Supabase Storage portfolio-media bucket
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const cleanFileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `account-${accountId}/${category.toLowerCase().replace(/\s+/g, '-')}/${cleanFileName}`;

      const { data: storageData, error: storageErr } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, { upsert: true });

      if (storageErr) {
        throw new Error(`Upload to storage failed: ${storageErr.message}`);
      }

      // 2. Get public CDN URL
      const { data: urlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 3. Record in portfolio_media database table
      await addPortfolioMedia({
        accountId,
        title: title.trim(),
        category: category.trim(),
        mediaUrl: publicUrl,
        mediaType: file.type.startsWith('video') ? 'video' : 'image',
      });

      setTitle("");
      setCategory("");
      setFile(null);
      await loadMedia();
    } catch (err: any) {
      console.error("Portfolio upload failed:", err);
      alert(err.message || "Failed to upload portfolio media");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePortfolioMedia(accountId, id);
      await loadMedia();
    } catch (err) {
      console.error("Failed to delete portfolio media:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-primary" />
            Upload Showcase Portfolio Media
          </CardTitle>
          <CardDescription>
            Upload showcase photos or videos tagged by service category. HyperAgent AI automatically sends these portfolio media items when answering customer inquiries on WhatsApp!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Title / Description</Label>
              <Input
                placeholder="e.g. Before / After Result"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Service Category Tag</Label>
              <Input
                placeholder="e.g. Service Category Name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Photo / Video</Label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,video/mp4"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="h-9 text-xs file:text-xs file:font-semibold"
                required
              />
            </div>

            <Button type="submit" disabled={uploading} className="h-9 text-xs gap-1.5">
              <UploadCloud className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Media"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Active Portfolio Gallery ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-8">Loading portfolio gallery...</p>
          ) : items.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No portfolio photos uploaded yet. Upload before/after photos above so AI can auto-attach them on WhatsApp!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="group relative rounded-lg border overflow-hidden bg-card shadow-sm hover:shadow-md transition">
                  <div className="h-36 w-full bg-slate-900 overflow-hidden relative">
                    {item.media_type === 'video' ? (
                      <div className="h-full w-full flex items-center justify-center bg-slate-950 text-white">
                        <Film className="w-8 h-8 text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        src={item.media_url}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] backdrop-blur-sm bg-black/60 text-white border-0">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <p className="text-xs font-medium truncate pr-2" title={item.title}>
                      {item.title}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive shrink-0"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
