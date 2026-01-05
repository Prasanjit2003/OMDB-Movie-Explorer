package com.jit.omdb.controller;


import com.jit.omdb.service.OmdbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class MovieController {

    @Autowired
    private OmdbService omdbService;

    @GetMapping("/search")
    public Map search(@RequestParam("q") String query) {
        return omdbService.searchMovies(query);
    }

    @GetMapping("/movie/{id}")
    public Map getDetails(@PathVariable("id") String id) {
        return omdbService.getMovieDetails(id);
    }
}
