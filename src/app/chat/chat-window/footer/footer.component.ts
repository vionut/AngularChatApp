import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SendBirdService } from 'src/app/sendbird.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input()
  chatUser;
  @Input()
  channel;
  inputDisabled = false;
  subs: Subscription[] = [];
  @Output()
  messageSent: EventEmitter<any> = new EventEmitter<any>();

  message = {
    text: '',
    attachments: []
  };

  constructor(public sendbirdService: SendBirdService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onSend() {
    this.inputDisabled = true;
    let messageToSend;
    if (this.message.attachments.length === 0) {
      messageToSend = this.message.text;
      this.message.text = '';
    }
    if (this.channel.channelType === 'open') {
      const sendMessageSub = this.sendbirdService
        .sendMessageToOpenChannel(this.channel, messageToSend)
        .subscribe(
          data => {
            console.log('Successfully sent message: ', data);
            this.inputDisabled = false;
            this.messageSent.emit(data);
          },
          error => {
            console.log(error.message);
            this.inputDisabled = false;
          }
        );
      this.subs.push(sendMessageSub);
    }
  }
}
