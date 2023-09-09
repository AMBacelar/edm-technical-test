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
    id: faker.string.uuid(),
  };
}
export const users = faker.helpers.multiple(createRandomUser, {
  count: 30,
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
  const query = req.query.query;
  const sortBy = req.query.sortBy;
  // got to add filtering and sorting logic here
  const filteredData = db.data.filter((item) => {
    if (!query) return true;
    // I'll just do a simple check if any of the fields contain any of the query
    for (const key in item) {
      if (
        key !== "id" &&
        item[key].toLowerCase().includes(query.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });

  const sortMap = {
    usernameAsc: "username",
    firstNameAsc: "firstName",
    lastNameAsc: "lastName",
    emailAsc: "email",
    usernameDesc: "username",
    firstNameDesc: "firstName",
    lastNameDesc: "lastName",
    emailDesc: "email",
  };

  const sortedData = sortBy
    ? filteredData.sort((a, b) => {
        if (
          new String(a[sortMap[sortBy]]).valueOf() ===
          new String(b[sortMap[sortBy]]).valueOf()
        ) {
          return 0;
        }
        let comparison =
          new String(a[sortMap[sortBy]]).valueOf() >
          new String(b[sortMap[sortBy]]).valueOf()
            ? 1
            : -1;

        return sortBy.includes("Desc") ? -comparison : comparison;
      })
    : filteredData;

  res.send(sortedData);
});

// of course there should be some sort of back end auth using cookies/tokens
// but I believe I'm pushing the scope of a fron-end technical test already T_T
app.post("/users", async (req, res) => {
  // same with making sure that the email is unique?
  db.data.push({ ...req.body.user, id: faker.string.uuid() });
  await db.write();
  res.send({ result: "ok", users: db.data });
});
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const index = db.data.findIndex((item) => item.id === id);
  if (index > -1) {
    db.data.splice(index, 1);
  }

  await db.write();
  res.send({ result: "ok", users: db.data });
});
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const index = db.data.findIndex((item) => item.id === id);
  if (index > -1) {
    db.data[index] = { ...req.body.user };
  }

  await db.write();
  res.send({ result: "ok", users: db.data });
});

// this is just if you want to store the current state of the db to disk
app.post("/store", async (req, res) => {
  await db.write();
  res.send({ result: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
