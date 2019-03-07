const CronJob = require('cron').CronJob;
const User = require('../module/employee/model')
const CheckIn = require('../module/checkin/model')
const CheckInDetail = require('../module/checkin/model/check_in_detail')
console.log('Before job instantiation');
/**
 * Job tu dong tao log giam sat vao luc 0h0p0s hang ngay
 */
const job = new CronJob('0 52 10 * * 0-4', async () => {
  try {
    const users = await User.find({role:1000})
    let newCheckIn = new CheckIn();
    newCheckIn.date=new Date();
    CheckIn.create({date:new Date()},(err, candies)=>{
      if(err){
        console.log({err})
      }else{
        const newCheckInDetail = users.map(el=>{
          return {
            user:el,
            pid:candies.iid

          }
        })
        CheckInDetail.insertMany(newCheckInDetail, function(error, docs) {
          if(err){
            console.log({error})
          }else {
            console.log({docs})
          }
        });
      }
    })
  }catch (e) {

  }
});

const job2 = new CronJob('0 55 9 * * 0-4', () => {
  const d = new Date();
  console.log('Second:', d.getMinutes());
});
console.log('After job instantiation');
job.start();
job2.start();
