import React, { useEffect, useState } from "react";
import { getMenuReviews } from "../services/review";
import ReviewCard from "./ReviewCard";

const MenuReviewsModal = ({ show, onClose, menuItem }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && menuItem) {
      fetchReviews();
    }
  }, [show, menuItem]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getMenuReviews(menuItem.id);
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !menuItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Reviews – {menuItem.name}
        </h2>

        {loading && <p>Loading...</p>}

        {!loading && reviews.length === 0 && (
          <p className="text-gray-500">Belum ada review</p>
        )}

        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MenuReviewsModal;
