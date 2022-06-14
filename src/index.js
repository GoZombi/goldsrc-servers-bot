const GameDig = require('gamedig');
const TelegramBot = require('node-telegram-bot-api');
const BotConfig = require('../appsettings.json');

const BotOptions = {
    polling: true,
    requestRules: true
};

const bot = new TelegramBot(BotConfig.telegram.botToken, BotOptions);
const spamGif = `${__dirname}/../assets/spam.gif`;

let antifloodTime = 0;

bot.onText(/\/get/, function onGetServer(msg) {
    let chatId = msg.chat.id;

    const MessageOptions = {
        reply_to_message_id: msg.message_id,
        parse_mode: 'markdown'
    };

    if (antifloodTime > Date.now()) {
        bot.sendDocument(chatId, spamGif, MessageOptions);
    }
    else {
        GameDig.query({
            type: 'cs16',
            host: '45.136.205.33',
            port: '27091',
            givenPortOnly: true
        })
            .then(state => {
                let players = '\0';
                let playersnum = 0;

                state.players.forEach(element => {
                    players += `*${++playersnum}. ${element.name}\n`
                    players += `Счет: ${element.raw.score} | Время игры ${Math.round(element.raw.time / 60)} мин.*\n`;
                    players += '---\n\n';
                });

                let answer = `Сервер: \`${state.name}\`\n`;
                answer += `Подключиться: \`${state.connect}\`\n`;
                answer += `Карта: \`${state.map}\`\n\n`;
                answer += `Игроков: \`${state.raw.numplayers}\` из \`${state.maxplayers}\`\n\n`
                answer += `Игроки:\n${players}`;

                antifloodTime = Date.now() + 5000;

                bot.sendMessage(chatId, answer, MessageOptions);
            })
            .catch((error => {
                console.log(error);
                bot.sendMessage(chatId, `Ошибка: ${error}.\nПожалуйста напишите в личку @uwwwr64 эту проблему и когда она случилась.`);
            }));
    }
});