import moment from 'moment'
function toDate(tm){
    return moment(tm).format('YYYY-MM-DD')
}
export default toDate
