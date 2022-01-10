class _Row {
    /**
     *
     * @param table_name
     * @param databaseWrapper
     * @param primary_key
     */
    constructor(table_name, databaseWrapper, primary_key) {
        this.table_name = table_name;
        this.databaseWrapper = databaseWrapper;
        this.primary_key = primary_key;
    }

    /**
     *
     * @param key_type
     * @param key
     * @returns {json} row
     * @private
     */
    _getRow(key_type, key) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE ${key_type}=?`, [key]);
    }

    /**
     *
     * @param key_type
     * @param key
     * @param column
     * @returns {undefined | *} column value
     * @private
     */
    _getColumn(key_type, key, column) {
        let row = this._getRow(key_type, key);
        if (row !== undefined && column in row) {
            return row[column];
        }
        else {
            return undefined;
        }
    }

    /**
     *
     * @param key_type
     * @param key
     * @param column_type
     * @param column_data
     * @private
     */
    _updateColumn(key_type, key, column_type, column_data) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET ${column_type}=? WHERE ${key_type}=?`, [column_data, key]);
    }

    /**
     *
     * @returns {number[]}
     */
    getAllPrimaryKeys() {
        let ids = [];
        let raw = this.databaseWrapper.get_all(`SELECT ${this.primary_key} FROM ${this.table_name}`);
        for (let i in raw) {
            ids.push(raw[i][this.primary_key]);
        }
        return ids;
    }

    /**
     *
     * @param id
     * @returns {json} row
     */
    getRowByPrimaryKey(id) {
        return this._getRow(this.primary_key, id);
    }

    /**
     *
     * @param row_id
     * @param column
     * @returns {undefined|*} column value
     */
    getColumnByPrimaryKey(row_id, column) {
        return this._getColumn(this.primary_key, row_id, column);
    }

    /**
     *
     * @param row_id
     * @param column_id
     * @param column_data
     */
    updateColumnByPrimaryKey(row_id, column_id, column_data) {
        this._updateColumn(this.primary_key, row_id, column_id, column_data);
    }
}

module.exports = _Row;