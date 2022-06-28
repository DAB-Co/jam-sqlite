const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class ForgotTokensUtils extends _Row {
    constructor(database) {
        super("forgot_password_tokens", database, "token");
    }

    addToken(email, token) {
        return this.databaseWrapper.run_query(`INSERT INTO forgot_password_tokens 
        (user_email, token, date_created) VALUES (?, ?, datetime('now'));`, [email, token]);
    }
}

module.exports = ForgotTokensUtils;
