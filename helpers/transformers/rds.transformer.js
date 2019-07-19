
const normalizeResponse = ({sqlStatementResults}) => ({
    data: sqlStatementResults.map(_normalizeRecords)
});

const _normalizeRecords = (item) => {
    let response = {
        updated: item.numberOfRecordsUpdated,
        records: [],
    };
    item.resultFrame.records.map((records, records_index) => {
        let tableHeader = item.resultFrame.resultSetMetadata.columnMetadata;
        response.records[records_index] = {};
        records.values.map((field, field_index) => {
            if(!field.isNull){
                response.records[records_index][tableHeader[field_index].name] = field.stringValue ? field.stringValue : field.intValue;
            }
        })
    })
    return response;
};

//const _fieldData = (field, tableHeader, index) => {
//    if(!field.isNull){
//        return {
//            item.resultFrame.resultSetMetadata.columnMetadata[field_index].name
//        }
//        response.records[records_index][] = field.stringValue;
//    }
//}

module.exports = {
    normalizeResponse,
};