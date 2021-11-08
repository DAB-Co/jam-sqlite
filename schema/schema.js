const fs = require("fs");
const path = require("path");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"));

module.exports = schema;
