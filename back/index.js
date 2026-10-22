import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
dotenv.config();

import helmet from "helmet";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import { csrfProtection } from "./middlewares/csrf.js";

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.js';
import routes from './routes/routes.js';

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

app.use(fileUpload());
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", process.env.APPLICATION_URL || "http://localhost:5173");
    },
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // désactive le CSP si besoin
  })
); 

app.use(cookieParser());

const corsOrigins = [
  process.env.APPLICATION_URL || "http://localhost:5173",
  ...(process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) ?? []),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use('/api/v1', routes);

// Optionnel : exposer le token CSRF pour le frontend
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const USE_HTTPS = process.env.USE_HTTPS === "true";

if (USE_HTTPS) {
  const privateKey = fs.readFileSync(
    "./config/dsp-dev-o24a-g4.fr_private_key.key",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "./config/dsp-dev-o24a-g4.fr_ssl_certificate.pem",
    "utf8"
  );
  const credentials = { key: privateKey, cert: certificate };
  https.createServer(credentials, app).listen(PORT, HOST, () => {
    console.log(`Secure HTTPS server running on ${HOST}:${PORT}`);
  });
} else {
  app.listen(PORT, HOST, () => {
    console.log(`App server running on ${HOST}:${PORT}`);
  });
}
