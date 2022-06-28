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

    tokenExists(token) {
        let result = this._getRow("token", token);
        return result !== undefined;
    }

    changePasswordFromToken(token, password) {
        this.databaseWrapper.run_query(`
            UPDATE accounts 
            SET user_password_hash=? 
            WHERE user_email=(
                SELECT user_email FROM forgot_password_tokens WHERE token=?
            );
        `, [password, token]);
        this.databaseWrapper.run_query(`
            DELETE FROM forgot_password_tokens WHERE token=?;
        `, [token]);
    }
}

module.exports = ForgotTokensUtils;
