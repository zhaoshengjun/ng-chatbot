import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public content: string, public sendBy: string) {}
}

@Injectable()
export class ChatService {
  readonly token = environment.dialogFlow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });
  constructor() {}

  conversation = new BehaviorSubject<Message[]>([]);

  update(msg: Message) {
    this.conversation.next([msg]);
  }

  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);
    return this.client.textRequest(msg).then(res => {
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage);
    });
  }

  // talk() {
  //   this.client.textRequest('Who are you').then(res => console.log(res));
  // }
}
