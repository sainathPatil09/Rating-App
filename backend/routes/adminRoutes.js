
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {User} from "../models/user.model.js";
import {Store} from "../models/store.model.js";
import bcrypt from "bcryptjs";

import {
  adminUsersCreated,
  adminStoresCreated,
  totalUsersGauge,
  totalStoresGauge
} from "../enhancedInstrumentation.mjs";


const router = express.Router();


// AdminL: Create user
router.post("/create-user", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    console.log(name, email, password, address, role);

    // Basic validation
    if (!name || !email || !password || !address) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    adminUsersCreated.add(1, { userId: user._id.toString() });
    res.status(201).json({ msg: "User created", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


/**
 * Admin: Create a store & assign owner
 */
router.post("/createStore", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const { name, email, address, owner } = req.body;
    console.log(name, email, address, owner);

    // 1. Check if owner exists
    const user = await User.findById(owner);
    if (!user) {
      return res.status(400).json({ msg: "Owner user not found" });
    }

    // 2. Check if that user has role = OWNER
    if (user.role !== "OWNER") {
      return res.status(400).json({ msg: "User is not a store owner" });
    }

    // 3. Create the store
    const store = new Store({ name, email, address, owner });
    await store.save();

    adminStoresCreated.add(1, { storeId: store._id.toString() });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Admin can view all users
router.get("/users", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const {
      name, 
      email, 
      address, 
      role,                  // ✅ filters
      sortBy = "name", 
      order = "asc",         // ✅ sorting
      page = 1, 
      limit = 10             // ✅ pagination
    } = req.query;

    // Build filter query
    const q = {};
    if (name)    q.name =    { $regex: name, $options: "i" };
    if (email)   q.email =   { $regex: email, $options: "i" };
    if (address) q.address = { $regex: address, $options: "i" };
    if (role)    q.role = role;

    // Sorting
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch results in parallel
    const [items, total] = await Promise.all([
      User.find(q)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-password"),   // ✅ don’t leak hashed passwords
      User.countDocuments(q)
    ]);

    res.json({
      items,                       // actual user data
      total,                       // total matched users
      page: Number(page),          // current page
      pages: Math.ceil(total / Number(limit)), // total pages
      limit: Number(limit)         // page size
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.get("/dashboard", protect, authorize("ADMIN"), async (req, res) => {
  try {
    // Run queries in parallel
    const [users, stores, totalUsers, totalStores] = await Promise.all([
      User.find(),
      Store.find().populate("owner", "name email"),
      User.countDocuments(),
      Store.countDocuments(),
    ]);

    // Calculate total ratings across all stores
    const totalRatings = stores.reduce(
      (acc, s) => acc + (s.ratings?.length || 0),
      0
    );

    res.json({
      // ✅ summary
      totalUsers,
      totalStores,
      totalRatings,

      // ✅ detailed store info
      stores: stores.map((s) => ({
        id: s._id,
        name: s.name,
        owner: s.owner?.name,
        avgRating: s.averageRating,
      })),

      // ✅ detailed user info
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.get("/stores", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const {
      name, email, address,                       // filters
      sortBy = "name", order = "asc",
      page = 1, limit = 10
    } = req.query;

    const match = {};
    if (name)    match.name    = { $regex: name, $options: "i" };
    if (email)   match.email   = { $regex: email, $options: "i" };
    if (address) match.address = { $regex: address, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    // Query stores with filters, sorting, and pagination
    const [stores, total] = await Promise.all([
      Store.find(match)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("owner", "_id name email role"), // include owner details
      Store.countDocuments(match)
    ]);

    // Format store data (add avgRating + userRating for the current user)
    const items = stores.map((store) => {
      const avgRating = store.ratings.length
        ? (store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
        : "0.00";

      const userRating =
        store.ratings.find((r) => r.user.toString() === req.user.id)?.value || null;

      return {
        id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating,
        userRating,
        owner: store.owner, // owner info populated above
      };
    });

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// view users details

router.get("/users/:id", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    let ownerInfo = null;
    if (user.role === "OWNER") {
      const store = await Store.findOne({ owner: user._id });
      if (store) {
        ownerInfo = {
          storeId: store._id,
          storeName: store.name,
          averageRating: Number(
            store.ratings.length ? (store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length).toFixed(2) : 0
          )
        };
      }
    }

    res.json({ user, ownerInfo });
  } catch (e) { res.status(500).json({ msg: e.message }); }
});




export default router;
