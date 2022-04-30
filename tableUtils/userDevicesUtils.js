const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))


class UserDevicesUtils extends _Row{
    constructor(database) {
        super("user_devices", database, "user_id");
    }

    /**
     *
     * @param user_id
     * @returns {undefined | string}
     */
    getDeviceId(user_id) {
        let res = this.databaseWrapper.get(`SELECT device_id FROM ${this.table_name} WHERE user_id=?`, [user_id]);
        if (res === undefined) {
            return undefined;
        }
        else {
            return res.device_id;
        }
    }

    /**
     *
     * @param user_id
     * @param device_id
     */
    updateDeviceId(user_id, device_id) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET device_id=? WHERE user_id=?`, [device_id, user_id]);
    }

    getAllDeviceIds() {
        return this.databaseWrapper.get_all(`SELECT * FROM ${this.table_name}`);
    }
}

module.exports = UserDevicesUtils;
