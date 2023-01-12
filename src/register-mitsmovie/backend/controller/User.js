import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
// untuk Register
export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({
      msg: "Password tidak sama",
    });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Registrasi Berhasil Silakan Login" });
  } catch (error) {
    console.log(error);
  }
};

// untuk Login

export const Login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });
    constmatch = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });
    const userID = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const tokenAkses = jwt.sign({ userID, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15s",
    });
    const tokenRefresh = jwt.sign({ userID, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    await User.update(
      { refresh_token: refresh_token },
      {
        where: {
          id: userID,
        },
      }
    );
    res.cookie("tokenRefresh", tokenRefresh, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ tokenAkses });
  } catch (error) {
    res.status(404).json({ msg: "Email anda tidak terdaftar" });
  }
};

// Untuk Logout
export const Logout = async (req, res) => {
  const tokenRefresh = req.cookies.tokenRefresh;
  if (!tokenRefresh) return res.sendStatus(204);
  const user = await User.findAll({
    where: {
      refresh_token: tokenRefresh,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userID = user[0].id;
  await user.update(
    { refresh_token: null },
    {
      where: {
        id: userID,
      },
    }
  );
  res.clearCookie("tokenRefresh");
  return res.sendStatus(200);
};
