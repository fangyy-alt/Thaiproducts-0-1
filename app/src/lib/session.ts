/**
 * 匿名 session cookie 管理
 *
 * V1 不接 Supabase；session id 由 cookie 持有，业务数据存内存 mock-store。
 * 上线前换成真实数据库时，此文件签名不变。
 */
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import { mockStore } from './mock-store';
import type { Session } from '@/types/session';

const COOKIE_NAME = 'hug_session';
const COOKIE_MAX_AGE = 24 * 60 * 60; // 24 小时

export function getOrCreateSession(): Session {
  const cookieStore = cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) {
    const s = mockStore.getSession(existing);
    if (s) return s;
  }

  const id = nanoid(16);
  const session = mockStore.createSession(id);
  // 注意：在 Server Component 不能写 cookie；只能在 Server Action / Route Handler / Middleware
  // 此函数仅做"创建/读取"，写 cookie 由 Route Handler 做（见 /api/session）
  return session;
}

export function getSessionFromCookie(): Session | null {
  const cookieStore = cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  if (!id) return null;
  return mockStore.getSession(id);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_COOKIE_MAX_AGE = COOKIE_MAX_AGE;
