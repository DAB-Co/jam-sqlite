class _Row {
    constructor(table_name, databaseWrapper, primary_key) {
        this.table_name = table_name;
        this.databaseWrapper = databaseWrapper;
        this.primary_key = primary_key;
    }

    getPrimaryKeys() {
        let ids = [];
        let raw = this.databaseWrapper.get_all(`SELECT ${this.primary_key} FROM ${this.table_name}`);
        for (let i in raw) {
            ids.push(raw[i][this.primary_key]);
        }
        return ids;
    }

    _getRow(identifier_type, identifier) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE ${identifier_type}=?`, [identifier]);
    }

    _getColumn(identifier_type, identifier, column) {
        let row = this._getRow(identifier_type, identifier);
        if (row !== undefined && column in row) {
            return row[column];
        }
        else {
            return undefined;
        }
    }

    _updateColumn(identifier_type, column_type, identifier, column) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET ${column_type}=? WHERE ${identifier_type}=?`, [column, identifier]);
    }

    getRowByPrimaryKey(id) {
        return this._getRow(this.primary_key, id);
    }
    getColumnByPrimaryKey(identifier, column) {
        return this._getColumn(identifier, column);
    }

    updateColumnByPrimaryKey(row_id, column_id, column_data) {
        this._updateColumn(this.primary_key, column_id, row_id, column_data);
    }
}

module.exports = _Row;