const moment = require('moment')
const CheckInDetail = require('./checkin/model/check_in_detail');

async function updateCheckIn(iid,timeStamp) {
  const time= moment.unix(timeStamp/1000);
  const y= time.year();
  const m = time.month();
  const d = time.date();
  const startTime = new Date(y,m-1,d-1,00,00,00).getTime();
  const endTime = new Date(y,m-1,d-1,23,59,00).getTime();

  CheckInDetail.findOne({

  })

}
