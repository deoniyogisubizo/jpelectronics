const { MongoClient } = require('mongodb');
const uri = 'mongodb://deoniyogisubizo:maiden410@ac-qhssfpd-shard-00-00.0xm8six.mongodb.net:27017,ac-qhssfpd-shard-00-01.0xm8six.mongodb.net:27017,ac-qhssfpd-shard-00-02.0xm8six.mongodb.net:27017/jptech?ssl=true&replicaSet=atlas-0xm8six-shard-0&authSource=admin&retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.close();
  }
}
run();