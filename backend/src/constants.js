export const DB_NAME = "haricharan";

export const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-site cookies in production
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
};
