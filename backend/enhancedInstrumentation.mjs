import { metrics } from "@opentelemetry/api";
import { MeterProvider } from "@opentelemetry/sdk-metrics-base";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import os from 'os';
// import { PerformanceObserver, performance, monitorEventLoopDelay  } from 'perf_hooks';
import { PerformanceObserver, performance, monitorEventLoopDelay, constants as perfConstants } from 'perf_hooks';

import { User } from "./models/user.model.js";
import { Store } from "./models/store.model.js";
import mongoose from "mongoose";

// Existing setup (keep your current setup)
const exporter = new PrometheusExporter(
  { startServer: true, port: 9464, endpoint: "/metrics" },
  () => {
    console.log("Prometheus scrape endpoint: http://localhost:9464/metrics");
  }
);

const meterProvider = new MeterProvider();
meterProvider.addMetricReader(exporter);
metrics.setGlobalMeterProvider(meterProvider);
const meter = metrics.getMeter("rating-app");

// ===== BUSINESS METRICS (Add these to your existing metrics) =====

// Rating-specific business metrics
export const ratingsSubmitted = meter.createCounter("ratings_submitted_total", {
  description: "Total number of ratings submitted",
});

export const averageRatingGauge = meter.createObservableGauge("current_average_rating", {
  description: "Current average rating across all stores",
});

export const activeUsersGauge = meter.createObservableGauge("active_users_count", {
  description: "Number of active users in the last hour",
});


// export const searchQueriesCounter = meter.createCounter("search_queries_total", {
//   description: "Total number of search queries performed",
// });

averageRatingGauge.addCallback(async (observableResult) => {
  try {
    // Aggregate across all stores
    const stores = await Store.find({}, "ratings").lean();
    let totalRatings = 0;
    let ratingSum = 0;

    stores.forEach((store) => {
      store.ratings.forEach((r) => {
        totalRatings++;
        ratingSum += r.value;
      });
    });

    const avg = totalRatings > 0 ? ratingSum / totalRatings : 0;
    observableResult.observe(avg);
  } catch (err) {
    console.error("Error fetching average rating:", err.message);
    observableResult.observe(0);
  }
});

activeUsersGauge.addCallback(async (observableResult) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: oneHourAgo },
    });

    observableResult.observe(activeUsers);
  } catch (err) {
    console.error("Error fetching active users:", err.message);
    observableResult.observe(0);
  }
});






//  ====== ACCOUNT, PROFILE, PASSWORD METRICS ======
export const accountProfileUpdates = meter.createCounter("account_profile_updates_total", {
  description: "Total number of profile updates",
});

export const accountPasswordChanges = meter.createCounter("account_password_changes_total", {
  description: "Total number of password changes",
});

export const accountPasswordFailures = meter.createCounter("account_password_failures_total", {
  description: "Failed password change attempts",
});


//  ======= ADMIN ROUTE METRICS =======
export const adminUsersCreated = meter.createCounter("admin_users_created_total", {
  description: "Total number of users created by admins",
});

export const adminStoresCreated = meter.createCounter("admin_stores_created_total", {
  description: "Total number of stores created by admins",
});

// Gauges (Otel doesn't have a direct Gauge like Prometheus, but uses ObservableGauge)
export const totalUsersGauge = meter.createObservableGauge("total_users", {
  description: "Total users in the system",
});

export const totalStoresGauge = meter.createObservableGauge("total_stores", {
  description: "Total stores in the system",
});

// callbacks for totalUsersGauge and totalStoresGauge
totalUsersGauge.addCallback(async (observableResult) => {
  const totalUsers = await User.countDocuments();
  observableResult.observe(totalUsers);
});

totalStoresGauge.addCallback(async (observableResult) => {
  const totalStores = await Store.countDocuments();
  observableResult.observe(totalStores);
});


//  ===== LOGIN and SIGNUP METRICS  ===============
export const userSignups = meter.createCounter("user_signups_total", {
  description: "Total number of user signups",
});

export const userLogins = meter.createCounter("user_logins_total", {
  description: "Total number of successful logins",
});

export const userLoginFailures = meter.createCounter("user_login_failures_total", {
  description: "Total number of failed login attempts",
});


// ===== ADVANCED SYSTEM METRICS =====

export const databaseConnectionsGauge = meter.createObservableGauge("database_connections_active", {
  description: "Number of active database connections",
});

// export const cacheHitRatio = meter.createObservableGauge("cache_hit_ratio", {
//   description: "Cache hit ratio as a percentage",
// });

// export const queueLengthGauge = meter.createObservableGauge("background_queue_length", {
//   description: "Length of background job queue",
// });

databaseConnectionsGauge.addCallback((observableResult) => {
  try {
    const activeConnections = mongoose.connections.filter(
      (conn) => conn.readyState === 1 // 1 = connected
    ).length;

    observableResult.observe(activeConnections);
  } catch (err) {
    console.error("Error collecting DB connections:", err.message);
    observableResult.observe(0);
  }
});

// ===== PERFORMANCE METRICS =====

export const gcTimeHistogram = meter.createHistogram("nodejs_gc_duration_seconds", {
  description: "Time spent in garbage collection",
  unit: "seconds",
});

export const eventLoopLagHistogram = meter.createHistogram("nodejs_eventloop_lag_seconds", {
  description: "Event loop lag in seconds", 
  unit: "seconds",
});

// const obs = new PerformanceObserver((list) => {
//   for (const entry of list.getEntries()) {
//     if (entry.entryType === "gc") {
//       // duration is in milliseconds → convert to seconds
//       gcTimeHistogram.record(entry.duration / 1000, {
//         kind: entry.kind === performance.constants.NODE_PERFORMANCE_GC_MAJOR ? "major" :
//               entry.kind === performance.constants.NODE_PERFORMANCE_GC_MINOR ? "minor" :
//               entry.kind === performance.constants.NODE_PERFORMANCE_GC_INCREMENTAL ? "incremental" :
//               "weak"
//       });
//     }
//   }
// });
// // Observe GC events
// obs.observe({ entryTypes: ["gc"], buffered: false });

const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "gc") {
      gcTimeHistogram.record(entry.duration / 1000, {
        kind: entry.kind === perfConstants.NODE_PERFORMANCE_GC_MAJOR ? "major" :
              entry.kind === perfConstants.NODE_PERFORMANCE_GC_MINOR ? "minor" :
              entry.kind === perfConstants.NODE_PERFORMANCE_GC_INCREMENTAL ? "incremental" :
              "weak"
      });
    }
  }
});

obs.observe({ entryTypes: ["gc"], buffered: false });


// Monitor event loop delay
const h = monitorEventLoopDelay({ resolution: 20 }); // checks every 20ms
h.enable();

// Record values periodically
setInterval(() => {
  const lag = h.mean / 1e9; // convert nanoseconds → seconds
  eventLoopLagHistogram.record(lag);
}, 5000);



// ===== MOCK DATA STORES (for realistic metrics) =====

let mockData = {
  activeUsers: new Set(),
  totalRatings: 0,
  ratingSum: 0,
  cacheHits: 0,
  cacheMisses: 0,
  dbConnections: 5,
  queueLength: 0,
  storeViews: 0,
  searchQueries: 0
};

// ===== OBSERVABLE METRIC CALLBACKS =====



// Enhanced CPU metrics with more detail
const detailedCpuGauge = meter.createObservableGauge("system_cpu_usage_percent", {
  description: "System CPU usage percentage",
});

let lastIdle = 0;
let lastTotal = 0;

detailedCpuGauge.addCallback((observableResult) => {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;

  const idleDiff = idle - lastIdle;
  const totalDiff = total - lastTotal;

  lastIdle = idle;
  lastTotal = total;

  if (totalDiff > 0) {
    const usage = (1 - idleDiff / totalDiff) * 100;
    observableResult.observe(usage);
  }
});

// Event loop lag monitoring
let lastTime = performance.now();
const eventLoopLagGauge = meter.createObservableGauge("nodejs_eventloop_lag_ms", {
  description: "Event loop lag in milliseconds",
});

eventLoopLagGauge.addCallback((observableResult) => {
  const now = performance.now();
  const lag = Math.max(0, now - lastTime - 100); // Expected 100ms interval
  lastTime = now;
  observableResult.observe(lag);
});



// ===== MIDDLEWARE FOR ENHANCED METRICS =====
export const enhancedMetricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  const userId = req.headers['user-id'] || `user_${Math.floor(Math.random() * 1000)}`;

  // Track unique users
  mockData.activeUsers.add(userId);

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e9;

    // Enhanced request tracking with more labels
    const labels = {
      route: req.route ? req.route.path : req.path,
      method: req.method,
      status: res.statusCode,
      user_agent: req.get('User-Agent') ? 'browser' : 'api',
      response_size: res.get('Content-Length') || '0'
    };

    // Record request metrics (your existing ones)
    requestCounter.add(1, labels);
    requestDuration.record(duration, labels);

    if (res.statusCode >= 400) {
      errorCounter.add(1, labels);
    }

    // Business logic simulation based on routes
    // if (req.path.includes('/stores') && req.method === 'GET') {
    //   if (req.path.includes('/stores/')) {
    //     // Store detail view
    //     const storeId = req.path.split('/')[3] || 'unknown';
    //     businessMetricsHelpers.recordStoreView(storeId, userId);
    //   }
    // }

    // if (req.path.includes('/search')) {
    //   const query = req.query.q || 'default';
    //   businessMetricsHelpers.recordSearch(query, userId);
    // }

    // // Simulate rating submission
    // if (req.path.includes('/ratings') && req.method === 'POST') {
    //   const rating = Math.floor(Math.random() * 5) + 1; // Random 1-5 rating
    //   const storeId = req.body?.storeId || 'store_' + Math.floor(Math.random() * 100);
    //   businessMetricsHelpers.recordRating(rating, userId, storeId);
    // }
  });

  next();
};

// ===== ANOMALY SIMULATION FUNCTIONS =====
export const anomalySimulator = {
  // Simulate a database connection leak
  simulateConnectionLeak: () => {
    console.log('🚨 Simulating database connection leak...');
    const interval = setInterval(() => {
      mockData.dbConnections += 2;
      if (mockData.dbConnections > 50) {
        clearInterval(interval);
        // Simulate connection pool recovery
        setTimeout(() => {
          mockData.dbConnections = 5;
        }, 300000); // 5 minutes
      }
    }, 10000); // Every 10 seconds
  },

  // Simulate cache invalidation (drops hit ratio)
  simulateCacheInvalidation: () => {
    console.log('🚨 Simulating cache invalidation...');
    const originalHits = mockData.cacheHits;
    mockData.cacheMisses += 1000; // Sudden spike in misses
    
    setTimeout(() => {
      mockData.cacheHits = originalHits;
      mockData.cacheMisses = Math.floor(mockData.cacheMisses * 0.2);
    }, 600000); // Recovery after 10 minutes
  },

  // Simulate background job queue backup
  simulateQueueBackup: () => {
    console.log('🚨 Simulating background job queue backup...');
    const interval = setInterval(() => {
      mockData.queueLength += 10;
      if (mockData.queueLength > 500) {
        clearInterval(interval);
        // Simulate queue processing recovery
        const recovery = setInterval(() => {
          mockData.queueLength = Math.max(0, mockData.queueLength - 20);
          if (mockData.queueLength === 0) {
            clearInterval(recovery);
          }
        }, 5000);
      }
    }, 5000);
  },

  // Simulate memory leak (gradual increase)
  simulateMemoryLeak: () => {
    console.log('🚨 Simulating memory leak...');
    const leakyArray = [];
    const interval = setInterval(() => {
      // Add large objects to simulate memory leak
      for (let i = 0; i < 1000; i++) {
        leakyArray.push(new Array(1000).fill('memory-leak-data'));
      }
      
      if (leakyArray.length > 50000) {
        clearInterval(interval);
        // Simulate garbage collection / restart
        setTimeout(() => {
          leakyArray.length = 0;
        }, 180000); // 3 minutes
      }
    }, 10000);
  },

  // Simulate sudden user activity spike
  simulateUserSpike: () => {
    console.log('🚨 Simulating user activity spike...');
    for (let i = 0; i < 500; i++) {
      mockData.activeUsers.add(`spike_user_${i}`);
    }
    
    // Users gradually leave
    setTimeout(() => {
      let count = 0;
      const cleanup = setInterval(() => {
        mockData.activeUsers.delete(`spike_user_${count}`);
        count++;
        if (count >= 500) {
          clearInterval(cleanup);
        }
      }, 1000);
    }, 300000); // Start cleanup after 5 minutes
  }
};

// ===== EXPORT YOUR EXISTING METRICS TOO =====
// Make sure to import these in your index.js
export const requestCounter = meter.createCounter("http_requests_total", {
  description: "Total number of HTTP requests",
});

export const requestDuration = meter.createHistogram(
  "http_request_duration_seconds",
  {
    description: "Request duration in seconds",
    unit: "seconds",
  }
);

export const errorCounter = meter.createCounter("http_errors_total", {
  description: "Total number of failed HTTP requests (status >= 400)",
});
