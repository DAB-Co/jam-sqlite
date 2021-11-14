class _Row {
    constructor(table_name, databaseWrapper) {
        this.table_name = table_name;
        this.databaseWrapper = databaseWrapper;
    }

    get_row_ids() {
        return this.databaseWrapper.getAll("SELECT id FROM ?", [this.table_name]);
    }

    get_column(row_id, column) {
        return this.databaseWrapper.get("SELECT ? FROM ? WHERE id=?", [column, this.table_name, row_id]);
    }
}

module.exports = _Row;