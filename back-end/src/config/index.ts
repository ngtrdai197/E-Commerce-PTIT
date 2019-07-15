import { db } from './db';
import * as mongoose from "mongoose";

export const connectDatabase = () => {
  const url = `mongodb+srv://${db.User}:${db.Password}@cluster0-esass.mongodb.net/${db.DATABASENAME}?retryWrites=true&w=majority`;
  // const url = `mongodb://localhost:27017/${db.DATABASENAME}`;
  mongoose
    .connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Database is connected ...`))
    .catch(error => console.log(error));
};
