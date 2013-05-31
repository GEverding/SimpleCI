
var indexCtrl = function(app) {
  app.get('/', function(req, res) {
    res.redirect('active');
  });
};

module.exports.init = function(app) {
  indexCtrl(app);
};
