import { User } from "../models/User.model.js";

const checkProfileCompletion = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.isProfileCompleted) {
    return res.status(403).json({ message: "Complete your profile first" });
  }
  next();
};
export { checkProfileCompletion };
