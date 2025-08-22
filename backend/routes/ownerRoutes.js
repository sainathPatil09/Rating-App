import express from "express";
import { Store } from "../models/store.model.js";
import { Rating } from "../models/rating.model.js";
import { User } from "../models/user.model.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Store Owner Dashboard
router.get("/dashboard", protect, authorize("OWNER"), async (req, res) => {
  try {
    // find store that belongs to this owner
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({ msg: "No store found for this owner" });
    }

    await store.populate("ratings.user", "name email");

    const avgRating = store.averageRating;

    res.json({
      store: {
        id: store._id,
        name: store.name,
        address: store.address,
        avgRating: avgRating,
      },
      ratings: store.ratings.map((r) => ({
        user: {
          id: r.user._id,
          name: r.user.name,
          email: r.user.email,
        },
        rating: r.value,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});



/**
 * Store Owner: View ratings for their store
 */
router.get("/my-store", protect, authorize("OWNER"), async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id }).populate(
      "ratings.user",
      "name email"
    );

    if (!store) return res.status(404).json({ msg: "No store found for this owner" });

    res.json({
      name: store.name,
      averageRating: store.averageRating,
      ratings: store.ratings.map((r) => ({
        user: r.user.name,
        email: r.user.email,
        value: r.value,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
