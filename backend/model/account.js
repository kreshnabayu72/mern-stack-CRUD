import mongoose from "mongoose";

export const accountSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
});

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;
