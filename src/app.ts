import { Markup, Telegraf } from 'telegraf';
import { getIdea } from './bored-api-controller';

require('dotenv').config();

const token: string = process.env.BOT_TOKEN as string;

const bot = new Telegraf(token);
const greatingMessage = `I'm a bot, that will give you a something todo idea. Just click on the button below or send me message idea and I will send you an idea.`;

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!' + '\n' + greatingMessage, Markup.inlineKeyboard([
    Markup.button.callback('Give me an idea!', 'idea'),
  ]));
});

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /idea to receive a message with an idea');
});

bot.on('text', async (ctx) => {
  if (ctx.message.text === 'idea') {
    const idea = await getIdea();
    return ctx.reply(idea + '\n' + "You want some more idea?", Markup.inlineKeyboard([
      Markup.button.callback('Give me an idea!', 'idea'),
    ]));
  } else {
    ctx.reply(
      'I don\'t understand you, ' + ctx.from.first_name + '.\n' +
      'Send /start to receive a greeting',
    );
  }
});

bot.action('idea', async (ctx) => {
  const idea = await getIdea();
  return ctx.reply(idea + '\n' + "You want some more idea?", Markup.inlineKeyboard([
    Markup.button.callback('Yeah, I want! Give me one more idea!', 'idea')
  ]));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));