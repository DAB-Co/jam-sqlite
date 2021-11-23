const fs = require("fs");
const path = require("path");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), {encoding:'utf8', flag:'r'});

module.exports = schema;
