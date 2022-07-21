require('dotenv').config()
const { createClient } = require('redis')
const { Pool } = require('pg')
const amqp = require('amqplib/callback_api')
const elasticseacrh = require('elasticsearch')
const { Client } = require('es7')

const redis = createClient({
   host: process.env.REDIS_HOST,
   port: 6379
})

const elastic = new elasticseacrh.Client({
   host: process.env.ELASTIC_HOST,
   maxRetries: 5,
   requestTimeout: 60000,
   apiVersion: 'master'
})

const psql = new Pool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   database: process.env.DB_DATABASE,
   password: process.env.DB_PASSWORD,
   port: 5432
})

const clients = new Client({
   node: process.env.ELASTIC_HOST,
   headers: { 'content-type': 'application/json; charset=UTF-8' }
})

const elasticBody = {
   from: 0,
   size: 12,
   query: {
      bool: {
         filter: [
            { match: { created_at: '2022-07-21T03:11:55.613Z' } },
            { match: { position: 'Frontend Web Developer' } }
         ]
      }
   }
}

const checkRedis = async () => {
   redis.setex('testkey', 30, 'hallo', (err, rep) => {
      if (err) {
         console.log(err)
         return
      }
      console.log('Redis connected')
   })
}

const checkAmqp = async () => {
   amqp.connect(`amqp://${process.env.AMQP_HOST}`, (err, conn) => {
      if (err) {
         console.log(err)
      }

      console.log('Rabbitmq connected')
   })
}

const checkElastic = async () => {
   try {
      const { body } = await clients.search({
         index: 'arkademy.hiring-platform-fazztrack',
         body: elasticBody,
         type: 'talent_list'
      })
      console.log(body)
   } catch (error) {
      console.log(error)
   }
}

const testPsqlAuth = async () => {
   psql.query('SELECT NOW()', (err, res) => {
      if (err) {
         console.log(err)
         return
      }
      console.log('postgres connected')
      psql.end()
   })
}

;(async () => {
   await testPsqlAuth()
   await checkRedis()
   await checkElastic()
   await checkAmqp()
})()
