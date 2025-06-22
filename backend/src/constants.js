export const DB_NAME = "haricharan";

export const options = {
  httpOnly: true,
  secure: false, // because you're using localhost (HTTP)
  sameSite: "strict", // or "lax" if frontend is on a different port
  path: "/",
};
