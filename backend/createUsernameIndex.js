const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bitrusmail:7gXJHQGiPR9mfBab@cluster0.1sgoxgf.mongodb.net/bitrusmail?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("bitrusmail");
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    console.log("Unique index on username created!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
