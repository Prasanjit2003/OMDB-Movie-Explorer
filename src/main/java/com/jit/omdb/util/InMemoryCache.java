package com.jit.omdb.util;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A generic Thread-Safe In-Memory Cache.
 * Implements:
 * 1. Max Size (Least Recently Used eviction policy via LinkedHashMap logic).
 * 2. Time-to-live (Expiry).
 * * @param <K> Key type
 * @param <V> Value type
 */
public class InMemoryCache<K, V> {

    private final long timeToLiveMillis;
    private final int maxItems;
    
    private final Map<K, CacheObject> cacheMap;

    public InMemoryCache(long timeToLiveSeconds, final int maxItems) {
        this.timeToLiveMillis = timeToLiveSeconds * 1000;
        this.maxItems = maxItems;
        
        this.cacheMap = new LinkedHashMap<K, CacheObject>(maxItems + 1, .75F, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, CacheObject> eldest) {
                return size() > maxItems;
            }
        };
    }

    public void put(K key, V value) {
        synchronized (cacheMap) {
            cacheMap.put(key, new CacheObject(value));
        }
    }

    public V get(K key) {
        synchronized (cacheMap) {
            CacheObject c = cacheMap.get(key);
            if (c == null) return null;

            if (System.currentTimeMillis() > (c.lastAccessed + timeToLiveMillis)) {
                cacheMap.remove(key); 
                return null;
            }
            
            return c.value;
        }
    }
    
    // Wrapper class to store the value and the time it was created
    private class CacheObject {
        public long lastAccessed = System.currentTimeMillis();
        public V value;

        protected CacheObject(V value) {
            this.value = value;
        }
    }
}
