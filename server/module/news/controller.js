const News = require('./model');
module.exports.handleGetNews = async (req, res, next) => {
  try {
    const { iid } = req.params;
    const user = req.user;
    const news = await News.find({
      'receiver.u.iid': parseInt(iid),
    });
    res.send({
      success: true,
      payload: news,
    });
  } catch (e) {}
};
module.exports.handleCreateNews = (req, res) => {
  const { type } = req.body;
  if (type === 'admin') {
    News.createNewsForAdmin('title', 'click', (err, doc) => {
      res.send({ err, doc });
    });
  } else if (type === 'employee') {
    News.createNewsForEmployee('title', 'click', (err, doc) => {
      res.send({ err, doc });
    });
  } else {
    return res.send({
      success: false,
      err: `type phai la admin hoac employee nhung nhan duoc ${type}`,
    });
  }
};
module.exports.updateStatus = (req, res) => {
  News.updateStatus(req.body.iid, (err, mes) => {
    if (err) {
      return res.send({
        success: false,
        err,
      });
    }
    return res.send({
      success: true,
      payload: mes,
    });
  });
};
