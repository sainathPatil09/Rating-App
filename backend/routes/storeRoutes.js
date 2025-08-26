import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { Store } from "../models/store.model.js";
import { User } from "../models/user.model.js";

// Import metrics helpers
import { ratingsSubmitted } from "../enhancedInstrumentation.mjs";

const router = express.Router();

/**
 * Normal User: Submit or update rating
 */
router.post("/:id/rate", protect, authorize("USER"), async (req, res) => {
  try {
    const { value } = req.body;
    const store = await Store.findById(req.params.id);

    if (!store) return res.status(404).json({ msg: "Store not found" });

    // Check if user already rated
    const existing = store.ratings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existing) {
      existing.value = value; // update rating
    } else {
      store.ratings.push({ user: req.user.id, value });
    }

    await store.save();

    // ---- Business Metric: record rating ----
    // businessMetricsHelpers.recordRating(
    //   value,
    //   req.user.id,
    //   req.params.id
    // );
    ratingsSubmitted.add(1, { storeId: req.params.id, userId: req.user.id });

    res.json({ msg: "Rating submitted", averageRating: store.averageRating });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * Store listing / search
 */
router.get("/", protect, async (req, res) => {
  try {
    const {
      name, address, sortBy = "name", order = "asc",
      page = 1, limit = 10
    } = req.query;

    const match = {};
    if (name)    match.name    = { $regex: name, $options: "i" };
    if (address) match.address = { $regex: address, $options: "i" };

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$ratings" }, 0] },
              { $round: [{ $avg: "$ratings.value" }, 2] },
              0
            ]
          },
          userRating: {
            $let: {
              vars: {
                mine: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r.user", req.user._id] }
                  }
                }
              },
              in: { $ifNull: [{ $arrayElemAt: ["$$mine.value", 0] }, null] }
            }
          }
        }
      },
      { $project: { name: 1, address: 1, averageRating: 1, userRating: 1 } },
      { $sort: { [sortBy]: order === "desc" ? -1 : 1 } },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    ];

    const [items, countAgg] = await Promise.all([
      Store.aggregate(pipeline),
      Store.aggregate([{ $match: match }, { $count: "total" }]),
    ]);

    res.json({
      items,
      total: countAgg[0]?.total || 0,
      page: Number(page),
      pages: Math.ceil((countAgg[0]?.total || 0) / Number(limit))
    });
  } catch (e) { 
    res.status(500).json({ msg: e.message }); 
  }
});

export default router;
