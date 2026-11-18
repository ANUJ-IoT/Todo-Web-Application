import dotenv from "dotenv/config";
import app from "./index.js";

app.listen(process.env.PORT, () => {
  console.log("working on port ", process.env.PORT);
});
