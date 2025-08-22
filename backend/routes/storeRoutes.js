
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {Store} from "../models/store.model.js";
import {User} from "../models/user.model.js";

const router = express.Router();

/**
 * Admin: Create a store & assign owner
 */
// router.post("/", protect, authorize("ADMIN"), async (req, res) => {
//   try {
//     const { name, email, address, owner } = req.body;

//     // 1. Check if owner exists
//     const user = await User.findById(owner);
//     if (!user) {
//       return res.status(400).json({ msg: "Owner user not found" });
//     }

//     // 2. Check if that user has role = OWNER
//     if (user.role !== "OWNER") {
//       return res.status(400).json({ msg: "User is not a store owner" });
//     }

//     // 3. Create the store
//     const store = new Store({ name, email, address, owner });
//     await store.save();

//     res.status(201).json(store);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });


/**
 * All Users: View list of stores
 */
// router.get("/", protect, async (req, res) => {
//   try {
//     const stores = await Store.find();

//     const storeData = stores.map((store) => {
//       const avgRating = store.averageRating; // uses your virtual
//       const userRating =
//         store.ratings.find((r) => r.user.toString() === req.user.id)?.value ||
//         null;

//       return {
//         id: store._id,
//         name: store.name,
//         email: store.email,
//         address: store.address,
//         avgRating,
//         userRating,
//       };
//     });

//     res.json(storeData);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });

/**
 * Normal User: Submit or update rating
 */
router.post("/:id/rate", protect, authorize("USER"), async (req, res) => {
  try {
    const { value } = req.body;
    console.log(value)
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
    res.json({ msg: "Rating submitted", averageRating: store.averageRating });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


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
  } catch (e) { res.status(500).json({ msg: e.message }); }
});



export default router;