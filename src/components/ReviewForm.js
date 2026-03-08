"use client";
import { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";
import { Textarea } from "./Input";

export default function ReviewForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating"); return; }
    if (comment.trim().length < 10) { setError("Comment must be at least 10 characters"); return; }
    setError("");
    onSubmit({ rating, comment });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <Textarea
        label="Your Review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this service provider..."
        rows={4}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
