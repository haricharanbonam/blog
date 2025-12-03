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
