import csurf from "csurf";

const crossOriginFront =
  process.env.NODE_ENV === "production" &&
  process.env.APPLICATION_URL?.startsWith("https://");

/** Cookie CSRF utilisable front (Cloudflare) ↔ API (Render) en cross-origin. */
export const csrfProtection = csurf({
  cookie: crossOriginFront
    ? { httpOnly: true, secure: true, sameSite: "none" }
    : true,
});
