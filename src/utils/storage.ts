import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AlgorithmDB extends DBSchema {
  settings: {
    key: string;
    value: {
      key: string;
      value: string | number | boolean;
      updatedAt: number;
    };
  };
  cache: {
    key: string;
    value: {
      key: string;
      data: unknown;
      expireAt: number;
    };
  };
}

let db: IDBPDatabase<AlgorithmDB> | null = null;

async function getDB(): Promise<IDBPDatabase<AlgorithmDB>> {
  if (db) return db;
  
  db = await openDB<AlgorithmDB>('leetcode-240-db', 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache', { keyPath: 'key' });
      }
    },
  });
  
  return db;
}

// 保存设置
export async function saveSetting(key: string, value: string | number | boolean): Promise<void> {
  const database = await getDB();
  await database.put('settings', {
    key,
    value,
    updatedAt: Date.now(),
  });
}

// 获取设置
export async function getSetting<T extends string | number | boolean>(
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    const database = await getDB();
    const result = await database.get('settings', key);
    if (result) {
      return result.value as T;
    }
  } catch (error) {
    console.error('Failed to get setting:', error);
  }
  return defaultValue;
}

// 保存缓存（带过期时间）
export async function setCache(key: string, data: unknown, ttlMs: number): Promise<void> {
  const database = await getDB();
  await database.put('cache', {
    key,
    data,
    expireAt: Date.now() + ttlMs,
  });
}

// 获取缓存
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const database = await getDB();
    const result = await database.get('cache', key);
    if (result) {
      if (Date.now() < result.expireAt) {
        return result.data as T;
      }
      // 缓存过期，但仍然返回数据作为备用
      return result.data as T;
    }
  } catch (error) {
    console.error('Failed to get cache:', error);
  }
  return null;
}

// 检查缓存是否有效（未过期）
export async function isCacheValid(key: string): Promise<boolean> {
  try {
    const database = await getDB();
    const result = await database.get('cache', key);
    if (result && Date.now() < result.expireAt) {
      return true;
    }
  } catch (error) {
    console.error('Failed to check cache:', error);
  }
  return false;
}
