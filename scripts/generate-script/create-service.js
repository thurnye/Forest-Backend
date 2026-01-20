#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

// ---------- helpers ----------
const toKebab = (str) =>
  String(str)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJSON = (p, data) =>
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- PORT REGISTRY ----------
function getNextPort(serviceName) {
  const registryPath = path.join(__dirname, "service-ports.json");

  if (!fs.existsSync(registryPath)) {
    throw new Error("service-ports.json not found");
  }

  const registry = readJSON(registryPath);

  if (registry.services[serviceName]) {
    throw new Error(`Port already assigned for ${serviceName}`);
  }

  const ports = Object.values(registry.services);
  const lastPort =
    ports.length > 0 ? Math.max(...ports) : registry.basePort;

  const nextPort = lastPort + 1;
  registry.services[serviceName] = nextPort;

  writeJSON(registryPath, registry);
  return nextPort;
}

// ---------- MAIN ----------
function main() {
  const rawName = process.argv[2];
  if (!rawName) {
    console.error("Usage: npm run create:service -- user");
    process.exit(1);
  }

  const name = toKebab(rawName);
  const serviceName = `${name}-service`;

  const root = process.cwd();
  const serviceDir = path.join(root, "services", serviceName);
  const srcDir = path.join(serviceDir, "src");

  if (fs.existsSync(serviceDir)) {
    console.error("Service already exists");
    process.exit(1);
  }

  // ---------- PORT ----------
  const PORT = getNextPort(serviceName);

  // ---------- FOLDERS ----------
  ensureDir(srcDir);
  [
    "controllers",
    "db",
    "routes",
    "middleware",
    "utils",
    "services",
  ].forEach((d) => ensureDir(path.join(srcDir, d)));

  // ---------- FILES ----------
  writeJSON(path.join(serviceDir, "package.json"), {
    name: `@readingForest/${serviceName}`,
    version: "1.0.0",
    description: `${capitalize(name)} service for ReadingForest Backend`,
    main: "dist/index.js",
    scripts: {
      dev: "ts-node-dev --respawn --transpile-only src/index.ts",
      build: "tsc",
      start: "node dist/index.js",
    },
    dependencies: {
      "@readingForest/libs": "file:../../libs",
      express: "^4.18.2",
      mongoose: "^8.0.3",
      helmet: "^7.1.0",
      cors: "^2.8.5",
      dotenv: "^16.3.1",
      joi: "^17.11.0",
      winston: "^3.11.0",
    },
    devDependencies: {
      "@types/express": "^4.17.21",
      "@types/cors": "^2.8.17",
      "@types/node": "^20.10.0",
      "ts-node-dev": "^2.0.0",
      typescript: "^5.3.3",
    },
  });

  writeJSON(path.join(serviceDir, "tsconfig.json"), {
    extends: "../../tsconfig.json",
    compilerOptions: {
      outDir: "./dist",
      rootDir: "./src",
    },
    include: ["src/**/*.ts"],
    exclude: ["node_modules", "dist"],
  });

  fs.writeFileSync(
    path.join(serviceDir, "README.md"),
    `# ${capitalize(name)} Service\n\nAuto-generated ReadingForest microservice.\n`
  );

  fs.writeFileSync(
    path.join(serviceDir, "swagger.ts"),
    `// swagger.ts\nexport {};\n`
  );

  // ---------- INDEX.TS (YOUR EXACT TEMPLATE) ----------
  fs.writeFileSync(
    path.join(srcDir, "index.ts"),
    `
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger, mapErrorToResponse } from '@readingForest/libs';
import { healthCheck } from './health';

dotenv.config();



const app = express();
const PORT = process.env.PORT || ${PORT};
const MONGODB_URI = process.env.MONGODB_URI!;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check
app.get('/health', healthCheck);

// Routes
// app.use('/', profileRoutes); //update with actual routes

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred', { error: err.message, stack: err.stack });
  const errorResponse = mapErrorToResponse(err);
  res.status(errorResponse.statusCode).json(errorResponse);
});

// MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info('${capitalize(name)} service running on port ' + PORT);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', { error: err.message });
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  mongoose.connection.close();
  process.exit(0);
});

export default app;
`.trim()
  );

  console.log(`✅ ${serviceName} created`);
  console.log(`🔌 Assigned port: ${PORT}`);
}

main();
