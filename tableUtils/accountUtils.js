const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class AccountUtils extends _Row {
    /**
     *
     * @param databaseWrapper
     */
    constructor(databaseWrapper) {
        super("accounts", databaseWrapper, "user_id");
    }

    /**
     *
     * @param username
     * @returns {boolean}
     */
    usernameExists(username) {
        let result = this._getRow("username", username);
        return result !== undefined;
    };

    /**
     *
     * @param email
     * @returns {boolean}
     */
    emailExists(email) {
        let result = this._getRow("user_email", email);
        return result !== undefined;
    }

    /**
     *
     * @param email
     * @param username
     * @param pass
     * @param api_token
     * @returns {json} {changes, lastInsertRowid}
     */
    addUser(email, username, pass, api_token) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash, user_api_token) VALUES (?, ?, ?, ?);", [email, username, pass, api_token]);
    };

    /**
     *
     * @param email
     * @param username
     * @param pass
     * @param api_token
     * @param notification_token
     * @returns {json} {changes, lastInsertRowid}
     */
    addUserWithNotificationToken(email, username, pass, api_token, notification_token) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash, user_api_token, user_notification_token) VALUES (?, ?, ?, ?, ?);", [email, username, pass, api_token, notification_token]);
    };

    /**
     *
     * @param email
     * @param username
     * @param pass
     * @param api_token
     * @param notification_token
     * @param public_key
     * @returns {*}
     */
    addUserWithTokensAndKey(email, username, pass, api_token, notification_token, public_key) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash, user_api_token, user_notification_token, public_key) VALUES (?, ?, ?, ?, ?, ?);", [email, username, pass, api_token, notification_token, public_key]);
    }

    /**
     *
     * @param id
     * @returns user_password_hash
     */
    getPasswordHash(id) {
        return this.getColumnByPrimaryKey(id, "user_password_hash");
    }

    /**
     *
     * @param id
     * @returns username
     */
    getUsernameById(id) {
        return this.getColumnByPrimaryKey(id, "username");
    }

    /**
     *
     * @param email
     * @returns {json} {user_id, user_email, username, user_password_hash, user_notification_token, user_api-token}
     */
    getRowByEmail(email) {
        let row = this._getRow("user_email", email);
        return row;
    }

    /**
     *
     * @param id
     * @returns notification_token
     */
    getNotificationToken(id) {
        return this.getColumnByPrimaryKey(id, "user_notification_token");
    }

    /**
     *
     * @param id
     * @param notification_token
     */
    updateNotificationToken(id, notification_token) {
        this.updateColumnByPrimaryKey(id, "user_notification_token", notification_token);
    }

    /**
     *
     * @param username
     * @param newToken
     */
    updateNotificationTokenByUsername(username, newToken) {
        this._updateColumn("username", username, "user_notification_token", newToken);
    }

    /**
     *
     * @param username
     * @returns client_id
     */
    getIdByUsername(username) {
        return this._getColumn("username", username, "user_id");
    }

    /**
     *
     * @param id
     * @returns api_token
     */
    getApiToken(id) {
        return this.getColumnByPrimaryKey(id, "user_api_token");
    }

    /**
     *
     * @param id
     * @param token
     */
    updateApiToken(id, token) {
        this.updateColumnByPrimaryKey(id, "user_api_token", token);
    }

    /**
     *
     * @param id
     * @param api_token
     * @param notification_token
     */
    updateTokens(id, api_token, notification_token) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET (user_api_token, user_notification_token)= (?, ?)
                                        WHERE ${this.primary_key} = ?`, [api_token, notification_token, id])
    }

    /**
     *
     * @param id
     */
    clearTokens(id) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET (user_api_token, user_notification_token)= (?, ?)
                                        WHERE ${this.primary_key} = ?`, ["", "", id]);
    }

    /**
     * 
     * @param user_id 
     */
    deleteUser(user_id) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE ${this.primary_key} = ?`,[user_id])
    }

    /**
     * 
     * @returns { [] } all notification tokens that are not null
     */
    getAllNotificationTokens() {
        let raw = this.databaseWrapper.get_all(`
        SELECT user_notification_token FROM ${this.table_name} 
        WHERE user_notification_token IS NOT NULL`);
        let tokens = [];
        for (let i of raw) {
            tokens.push(i["user_notification_token"]);
        }
        return tokens;
    }

    /**
     *
     * @param {number} user_id
     * @param {boolean} inactivity
     */
    setInactivity(user_id, inactivity) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET inactive=${inactivity ? "TRUE" : "FALSE"} WHERE user_id=?`, [user_id]);
    }

    /**
     *
     * @returns {Set<number>}
     */
    getAllInactives() {
        let raw = this.databaseWrapper.get_all(`
        SELECT user_id FROM ${this.table_name} 
        WHERE inactive=TRUE`);
        let inactives = new Set();
        for (let i of raw) {
            inactives.add(i["user_id"]);
        }
        return inactives;
    }
}

module.exports = AccountUtils;