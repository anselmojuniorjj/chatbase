// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const axios = require('axios');
var chatbase = require('@google/chatbase');
    
class MyBot {
    /**
     *
     * @param {TurnContext} on turn context object.
     */

     constructor(){
        let contexto;
     }
        
    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            // envia requisição para o orchestrator
            await axios.post('http://localhost:8080/orchestrator', {
                text: turnContext._activity.text,
                context: this.contexto
            })
                .then(async (res) => {

                    // chama método do chatBase
                    this.contexto = res;
                    this.chatBase(this.contexto);
                
                    // verifica se existe mais de uma mensagem
                    const textLen = res.data.output.text.length;
                    if (textLen > 1) {
                        for (var i = 0; i < textLen; i++) {
                            await turnContext.sendActivity(res.data.output.text[i]);
                        }
                    } else {
                        await turnContext.sendActivity(res.data.output.generic[0].text);
                    }
                    this.contexto = res.data.context;
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }

    // faz conexão com chatBase
    chatBase(contexto) {
        
    let nodeVisited = contexto.data.output.nodes_visited;

    chatbase.setApiKey('6bea6b85-b398-4f28-be19-0e571618111b')
    .setUserId('some-unique-user-id') // The id of the user you are interacting with
    .setPlatform('watson') // The platform the bot is interacting on/over
    .setVersion('1.0') // The version of the bot deployed

    if (nodeVisited == 'Em outros casos') {
        chatbase.newMessage()
        .setAsNotHandled()
        .setMessage(contexto.data.input.text)
        .setIntent(contexto.data.intents.intent)
        .send()
        .then(msg => console.log(msg.getCreateResponse()))
        .catch(err => console.error(err)); 
    } else {
        chatbase.newMessage()
        .setMessage(contexto.data.input.text)
        .setIntent(contexto.data.intents.intent)
        .send()
        .then(msg => console.log(msg.getCreateResponse()))
        .catch(err => console.error(err));
    }
}

}

module.exports.MyBot = MyBot;
