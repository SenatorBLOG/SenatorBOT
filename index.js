const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN) //сюда помещается токен, который дал botFather

const getInvoice = (id) => {
  const invoice = {
    chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
    provider_token: process.env.PROVIDER_TOKEN, 
    title: 'Postcard', 
    description: 'Your memory from around the world', 
    currency: 'rub', // Трехбуквенный код валюты ISO 4217
    prices: [
      { label: 'Postcard', amount: 2 * 100 * 100 },
      { label: 'Travel Photo', amount: 2 * 100 * 75 }
    ], 
    photo_url: 'https://www.forma-studio.com/assets/images/postcards/otkritki_01.jpg',
    is_flexible: true,
    photo_width: 500, // Ширина фото
    photo_height: 281, // Длина фото
    payload: { // Полезные данные счета-фактуры, определенные ботом, 1–128 байт. Это не будет отображаться пользователю, используйте его для своих внутренних процессов.
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN 
    }
  }

  return invoice
}

bot.use(Telegraf.log())
bot.start((ctx) => ctx.reply(`Hi ${ctx.message.from.first_name}`));
bot.help((ctx) => ctx.reply('Use the PAY command to get an invoice for payment'));
bot.command('pay', (ctx) => {    // это обработчик конкретного текста, данном случае это - "pay"
  return ctx.replyWithInvoice(getInvoice(ctx.from.id)) //  метод replyWithInvoice для выставления счета  
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) // ответ на предварительный запрос по оплате

bot.on('successful_payment', async (ctx, next) => { // ответ в случае положительной оплаты
  await ctx.reply('SuccessfulPayment')
})

bot.launch()
