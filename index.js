require('dotenv').config()
const { createClient } = require('redis')
const amqp = require('amqplib/callback_api')

const redis = createClient({
   url: `redis://${process.env.REDIS_HOST}:6379`
})

const checkRedis = async () => {
   try {
      await redis.connect()
      const data = await redis.get('testkey')

      if (data === 'OK' || data == null) {
         console.log('redis connected')
      } else {
         console.log(data)
      }
      await redis.quit()
   } catch (error) {
      console.log(error)
   }
}

const checkAmqp = async () => {
   amqp.connect(`amqp://${process.env.AMQP_HOST}`, (err, conn) => {
      if (err) {
         console.log(err)
      }

      console.log('Rabbitmq connected')
   })
}

console.log(`amqp://${process.env.AMQP_HOST}`)

checkRedis()
checkAmqp()
