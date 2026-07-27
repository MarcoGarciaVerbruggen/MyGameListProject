// ReviewController.java
package app.Review.controller;

import app.Review.model.Review;
import app.Review.model.ReviewID;
import app.Review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<Review> getAll() {
        return reviewService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.findById(new ReviewID(id)));
    }

    @PostMapping
    public ResponseEntity<Review> create(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.create(review));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable UUID id, @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.update(new ReviewID(id), review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        reviewService.delete(new ReviewID(id));
        return ResponseEntity.noContent().build();
    }
}