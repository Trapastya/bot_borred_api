import { Markup, Telegraf } from 'telegraf';
import { getIdea } from './bored-api-controller';

require('dotenv').config();

const token: string = process.env.BOT_TOKEN as string;

const bot = new Telegraf(token);
const greetingMessage : string = `I'm a bot, that will give you an idea of something to do. Just click on the button below or send me a word "idea" and I will send you an idea of something to do for you.`;
const youWantMoreIdeaMessage : string = `Click the button below, if you want more ideas!💡`;
const helpMessage : string = `ℹ️Send /start to receive a help message.\nℹ️Send /idea to receive a message with an idea.`;
const giveMeIdeaLabelButton: string = `Give me an idea!📔`; 
const yeahGiveMeMoreLabelButton : string = `Yeah, I want! Give me one more idea!📔`;
const youWelcomeMessage : string = `You're welcome!😸`;

bot.command('idea', async (ctx) => {
  const idea = await getIdea();
  return ctx.reply(`${idea}\n\n${youWantMoreIdeaMessage}`, Markup.inlineKeyboard([
    Markup.button.callback(yeahGiveMeMoreLabelButton, 'idea')
  ]));
});

bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name} ✌️🤖!\n${greetingMessage}`, Markup.inlineKeyboard([
    Markup.button.callback(giveMeIdeaLabelButton, 'idea'),
  ]));
});

bot.help((ctx) => {
  ctx.reply(helpMessage);
});

bot.on('text', async (ctx) => {
  if (ctx.message.text.toLowerCase().includes('thank')) {
    return ctx.reply(`${youWelcomeMessage}\n${youWantMoreIdeaMessage}`, Markup.inlineKeyboard([
      Markup.button.callback(giveMeIdeaLabelButton, 'idea'),
    ]));
  }
  if (ctx.message.text === 'idea') {
    const idea = await getIdea();
    return ctx.reply(`${idea}\n${youWantMoreIdeaMessage}`, Markup.inlineKeyboard([
      Markup.button.callback(giveMeIdeaLabelButton, 'idea'),
    ]));
  } else {
    ctx.reply(helpMessage);
  }
});

bot.action('idea', async (ctx) => {
  const idea = await getIdea();
  return ctx.reply(`${idea}\n\n${youWantMoreIdeaMessage}`, Markup.inlineKeyboard([
    Markup.button.callback(yeahGiveMeMoreLabelButton, 'idea')
  ]));
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));