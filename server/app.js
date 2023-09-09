import express from "express";
import cors from "cors";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };
}
export const users = faker.helpers.multiple(createRandomUser, {
  count: 10,
});

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const defaultData = users;

const db = new Low(adapter, defaultData);

await db.read();
await db.write();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.send(db.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
