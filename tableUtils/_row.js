class _Row {
    constructor(table_name, databaseWrapper, primary_key) {
        this.table_name = table_name;
        this.databaseWrapper = databaseWrapper;
        this.primary_key = primary_key;
    }

    get_row_ids() {
        return this.databaseWrapper.getAll("SELECT ? FROM ${this.table_name}", [this.primary_key]);
    }

    get_row(id) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE ${this.primary_key}=?`, [id]);
    }

    get_column(row_id, column) {
        return this.get_row(row_id)[column];
    }

    update_column(row_id, column_id, column_data) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET ${column_id}=? WHERE ${this.primary_key}=?`, [column_data, row_id]);
    }
}

module.exports = _Row;