class _Row {
    constructor(table_name, databaseWrapper, primary_key) {
        this.table_name = table_name;
        this.databaseWrapper = databaseWrapper;
        this.primary_key = primary_key;
    }

    _getRow(key_type, key) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE ${key_type}=?`, [key]);
    }

    _getColumn(key_type, key, column) {
        let row = this._getRow(key_type, key);
        if (row !== undefined && column in row) {
            return row[column];
        }
        else {
            return undefined;
        }
    }

    _updateColumn(key_type, key, column_type, column_data) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET ${column_type}=? WHERE ${key_type}=?`, [column_data, key]);
    }

    getAllPrimaryKeys() {
        let ids = [];
        let raw = this.databaseWrapper.get_all(`SELECT ${this.primary_key} FROM ${this.table_name}`);
        for (let i in raw) {
            ids.push(raw[i][this.primary_key]);
        }
        return ids;
    }

    getRowByPrimaryKey(id) {
        return this._getRow(this.primary_key, id);
    }

    getColumnByPrimaryKey(row_id, column) {
        return this._getColumn(this.primary_key, row_id, column);
    }

    updateColumnByPrimaryKey(row_id, column_id, column_data) {
        this._updateColumn(this.primary_key, row_id, column_id, column_data);
    }
}

module.exports = _Row;