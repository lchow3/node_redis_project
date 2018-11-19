var redis = require('redis');
var client = redis.createClient();

client
  .on("connect", () => {
    console.log("Redis Server Connected.");
  })
  .on("error", function (err) {
    console.log("Error " + err);
  });

function getKeys(queryStr) {
  return new Promise((resolve, reject) => {
    client.keys(queryStr, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};

function getKeyValuePair(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ key: key, value: res });
    });
  });
};

async function getValue(key, callback) {
  var pair = await getKeyValuePair(key);
  callback(pair);
}

exports.dump_data = (req, res) => {
  console.log('dump_data');
  var obj = {};

  async function getValues() {
    var promises = []
    var keys = await getKeys('*');

    var keyValuePairs = []
    for (let i = 0; i < keys.length; i++) {
      keyValuePairs.push(await getKeyValuePair(keys[i]));
    }

    res.status(200).send(keyValuePairs);
  };

  getValues();
}

exports.create_data = (req, res) => {
  var data = req.body;

  // check client.set() as an async call
  data.forEach(entry => {
    client.set(entry.key, entry.value);
  })

  console.log(data);
  res.sendStatus(200);
}

/*
Returns null if key:value pair is not found
 */
exports.read_data = (req, res) => {
  console.log('read_data', req.params);
  async function getValue(key) {
    var pair = await getKeyValuePair(key);
    res.status(200).send(pair);
  }

  getValue(req.params.key);
}

exports.update_data = (req, res) => {

  var key = req.params.key;
  var value = req.body.value;

  var callback = (pair) => {
      if (!pair.value) {
        res.status(200).send("Key " + pair.key + " not found.");
        return;
      }

      client.set(pair.key, value);
      res.sendStatus(200);
      return;
  }

  getValue(key, callback);
}

exports.delete_data = (req, res) => {
  console.log('delete_data', req.params);
  client.del(req.params.key);
  res.sendStatus(200);
}
