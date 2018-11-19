// all express.js

'use strict';

module.exports = function(app) {
  var dataList = require('../controllers/dataController');

  app
    .route('/data')
    .get(dataList.dump_data)
    .post(dataList.create_data);

  app.route('/data/read/:key')
    .get(dataList.read_data);

  app.route('/data/update/:key')
    .put(dataList.update_data);

  app.route('/data/delete/:key')
    .delete(dataList.delete_data);
};
