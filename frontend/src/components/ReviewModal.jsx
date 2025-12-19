import React, { useState } from "react";
import { createReview } from "../services/review";
import StarRating from "./StarRating";

const ReviewModal = ({ show, onClose, menuItem, onReviewSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show || !menuItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Pilih rating dulu");
      return;
    }

    try {
      setLoading(true);
      await createReview({
        menuItemId: menuItem.id,
        rating,
        comment,
      });

      setRating(0);
      setComment("");
      onReviewSuccess();
      onClose();
    } catch {
      alert("Gagal submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">
          Review {menuItem.name}
        </h2>

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          className="w-full border rounded p-2"
          placeholder="Tulis komentar (opsional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewModal;
