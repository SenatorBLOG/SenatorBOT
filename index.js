const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN) //сюда помещается токен, который дал botFather

const getInvoice = (id) => {
  const invoice = {
    chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
    provider_token: process.env.PROVIDER_TOKEN, 
    title: 'Временно недоступны', 
    description: 'Your memory from around the world', 
    currency: 'rub', // Трехбуквенный код валюты ISO 4217
    prices: [
      { label: 'Временно недоступны', amount: 7 * 100 * 50 }
    ], 
    photo_url: 'https://static5.depositphotos.com/1008458/490/i/600/depositphotos_4906550-stock-photo-red-stop-sign.jpg',
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
bot.help((ctx) => ctx.reply('Открытки можно купить переводом на мой номер +79802510158, в сообщении к переводу укажите страну,город,индекс и точный адрес с квартирой,и конечно же ИМЯ на которое отправить открытку! Стоимость 350рублей.'));
bot.command('pay', (ctx) => {    // это обработчик конкретного текста, данном случае это - "pay"
  return ctx.replyWithInvoice(getInvoice(ctx.from.id)) //  метод replyWithInvoice для выставления счета  
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) // ответ на предварительный запрос по оплате

bot.on('successful_payment', async (ctx, next) => { // ответ в случае положительной оплаты
  await ctx.reply('SuccessfulPayment')
})

bot.launch()
