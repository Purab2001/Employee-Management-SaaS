const { MongoMemoryServer } = require("mongodb-memory-server")

let mongoServer

module.exports = async function globalSetup() {
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()
  global.__MONGO_SERVER__ = mongoServer
}
