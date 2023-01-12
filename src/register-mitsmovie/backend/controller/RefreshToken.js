import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const tokenRefresh = async (req, res) => {
  try {
    const tokenRefresh = req.cookies.tokenRefresh;
    if (!tokenRefresh) return res.sendStatus(401);
    const user = await User.findAll({
      where: {
        refresh_token: tokenRefresh,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) return res.sendStatus(403);
      const userID = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const tokenAkses = jwt.sign({ userID, name, email }, process.env.ACCESS_TOKEN_SECRETS, {
        expiresIn: "15s",
      });
      res.json({ tokenAkses });
    });
  } catch (error) {
    console.log(error);
  }
};
