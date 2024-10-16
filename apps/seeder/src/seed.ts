import countries from "./countries.json";
import "dotenv/config";
import { connect, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface CountryModel {
  name: string;
  code: string;
}
const countrySchema = new Schema<CountryModel>({
  name: { type: String, required: true },
  code: { type: String, required: true },
});
const Country = model<CountryModel>("countries", countrySchema);

interface UserModel {
  fullname: string;
  email: string;
  password: string;
}
const userSchema = new Schema<UserModel>({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = model<UserModel>("users", userSchema);

const users: UserModel[] = [
  {
    fullname: "usertest 1",
    email: "usertest1@gmail.com",
    password: "usertest1password",
  },
  {
    fullname: "usertest 2",
    email: "usertest2@gmail.com",
    password: "usertest2password",
  },
];

async function seedMongoDB() {
  await connect(process.env.MONGODB_URL!);
  console.log("success connect to mongodb");

  // seed countries
  console.log("seed countries");
  countries.data.forEach(async (item) => {
    console.log("Inserting: ", item);
    await Country.create({
      name: item.name.trim(),
      code: item.alpha2.trim(),
    });
  });

  // seed users
  console.log("seed users");
  users.forEach(async (item) => {
    console.log("Inserting: ", item);
    const hashedPassword = await bcrypt.hash(item.password, 12);
    await User.create({
      fullname: item.fullname,
      password: hashedPassword,
      email: item.email,
    });
  });

  const insertedCountries = await Country.find();
  console.log(insertedCountries);
  const insertedUsers = await User.find();
  console.log(insertedUsers);
}
seedMongoDB()
  .then(() => {
    console.log("seed success");
    process.exit();
  })
  .catch((err) => {
    console.error("seed error", err);
    process.exit(1);
  });
