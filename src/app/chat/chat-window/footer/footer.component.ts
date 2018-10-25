import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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
  openPopup: Function;
  loading = false;

  message = {
    text: '',
    attachment: null
  };

  constructor(public sendbirdService: SendBirdService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  setPopupAction(fn: any) {
    this.openPopup = fn;
  }

  onFileSelected(event) {
    this.message.attachment = event.target.files[0];
  }

  onSend(inputRef) {
    this.loading = true;
    const input = inputRef.inputEl.nativeElement;
    this.inputDisabled = true;
    const messageToSend = this.message.text;
    const fileToSend = this.message.attachment ? this.message.attachment : null;
    const sendMessageSub = this.sendbirdService
      .sendMessageToChannel(this.channel, messageToSend)
      .subscribe(
        data => {
          console.log('Successfully sent message: ', data);
          this.messageSent.emit(data);
          if (!fileToSend) {
            this.inputDisabled = false;
            input.focus();
            this.message.text = '';
            this.loading = false;
          } else {
            const sendFileSub = this.sendbirdService
              .sendFileMessageToChannel(this.channel, fileToSend)
              .subscribe(
                data => {
                  console.log('Successfully sent message: ', data);
                  this.messageSent.emit(data);
                  this.inputDisabled = false;
                  input.focus();
                  this.message.text = '';
                  this.message.attachment = null;
                  this.loading = false;
                },
                error => {
                  console.log(error.message);
                  this.inputDisabled = false;
                }
              );
            this.subs.push(sendFileSub);
          }
        },
        error => {
          console.log(error.message);
          this.inputDisabled = false;
        }
      );
    this.subs.push(sendMessageSub);
  }

  onInputEnterPressed(event, inputRef) {
    if (event.keyCode == 13) {
      this.onSend(inputRef);
    }
  }
}
