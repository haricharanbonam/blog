export const DB_NAME = "haricharan";

// export const options = {
//   httpOnly: true,
//   secure: false,
//   sameSite: "strict",  //mistake
//   path: "/",
// };

const isLocal = process.env.NODE_ENV === "local";

export const options = {
  httpOnly: true,
  secure: !isLocal,
  sameSite: isLocal ? "lax" : "none",
  path: "/",
};


export function generateUsername(name) {
  if (!name) return "";

  // clean and split
  const parts = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/);

  const first = parts[0] || "";
  const last = parts[1] || "";

  let base = last ? `${first}${last}` : first;

  // ensure length
  if (base.length < 6) {
    const fill = Math.random()
      .toString(36)
      .substring(2, 8 - base.length);
    base += fill;
  }

  return base;
}
