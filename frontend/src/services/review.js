import api from "./api";

// POST review
export const createReview = async ({ menuItemId, rating, comment }) => {
  const res = await api.post("/reviews", {
    menu_item_id: menuItemId,
    rating,
    comment,
  });
  return res.data;
};

// GET reviews by menu
export const getMenuReviews = async (menuId) => {
  const res = await api.get(`/menu/${menuId}/reviews`);
  return res.data;
};
