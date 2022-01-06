/// <reference types="@cloudflare/workers-types" />

declare interface CacheStorage {
  open(cacheName: string): Promise<Cache>;
  readonly default: Cache;
}

declare const AIRTABLE_BASE: string;
declare const AIRTABLE_KEY: string;
