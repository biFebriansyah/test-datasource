require('dotenv').config()
const { createClient } = require('redis')
const amqp = require('amqplib/callback_api')
const elasticseacrh = require('elasticsearch')

// const redis = createClient({
//    url: `redis://${process.env.REDIS_HOST}:6379`
// })
const redis = createClient({
   host: process.env.REDIS_HOST,
   port: 6379
})

const elastic = new elasticseacrh.Client({
   host: process.env.ELASTIC_HOST,
   apiVersion: 'master'
})

const checkRedis = () => {
   redis.setex('testkey', 30, 'hallo', (err, rep) => {
      if (err) {
         console.log(err)
         return
      }
      console.log(rep)
   })
}
// const checkRedis = async () => {
//    try {
//       await redis.connect()
//       const data = await redis.get('testkey')

//       if (data === 'OK' || data == null) {
//          console.log('redis connected')
//       } else {
//          console.log(data)
//       }
//       await redis.quit()
//    } catch (error) {
//       console.log(error)
//    }
// }

const checkAmqp = async () => {
   amqp.connect(`amqp://${process.env.AMQP_HOST}`, (err, conn) => {
      if (err) {
         console.log(err)
      }

      console.log('Rabbitmq connected')
   })
}

const checkElastic = async () => {
   elastic.indices.create(
      {
         index: 'test-elastic2'
      },
      (err, res, status) => {
         if (err) {
            console.log(err)
            return
         }
         console.log(res)
      }
   )
}

// checkElastic()
checkRedis()
// checkAmqp()
