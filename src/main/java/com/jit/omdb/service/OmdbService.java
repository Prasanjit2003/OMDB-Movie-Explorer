package com.jit.omdb.service;


import com.jit.omdb.util.InMemoryCache;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Service
public class OmdbService {

    // Your API Key
    private static final String API_KEY = "YOUR API KEY";
    private static final String BASE_URL = "https://www.omdbapi.com/";

    private final InMemoryCache<String, Map> movieCache = new InMemoryCache<>(60, 100);
    
    private final RestTemplate restTemplate;

    public OmdbService() {
        this.restTemplate = new RestTemplate();
    }
    
    public Map searchMovies(String query) {
        String cacheKey = "SEARCH_" + query.toLowerCase();
        
        // 1. Check Cache
        Map cachedData = movieCache.get(cacheKey);
        if (cachedData != null) {
            System.out.println("Fetching from CACHE: " + query);
            return cachedData;
        }

        // 2. Fetch from OMDB
        System.out.println("Fetching from API: " + query);
        String url = String.format("%s?apikey=%s&s=%s", BASE_URL, API_KEY, query);
        
        // We use Map.class to keep the JSON structure dynamic without creating 20 DTO classes
        Map response = restTemplate.getForObject(url, Map.class);
        
        // 3. Store in Cache
        if (response != null && response.containsKey("Search")) {
             movieCache.put(cacheKey, response);
        }
        
        return response;
    }

    public Map getMovieDetails(String imdbId) {
        String cacheKey = "DETAIL_" + imdbId;
        
        Map cachedData = movieCache.get(cacheKey);
        if (cachedData != null) {
             System.out.println("Fetching details from CACHE: " + imdbId);
             return cachedData;
        }

        String url = String.format("%s?apikey=%s&i=%s&plot=full", BASE_URL, API_KEY, imdbId);
        Map response = restTemplate.getForObject(url, Map.class);
        
        if (response != null) {
            movieCache.put(cacheKey, response);
        }
        return response;
    }
}
