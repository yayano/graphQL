const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/Schema");
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
mongoose.connect(process.env.URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("listening on port 4000 && connected to the db");
  });
});
