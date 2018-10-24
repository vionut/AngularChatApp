import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  @Input()
  messages;
  @Input()
  currentChannel;
  @Input()
  chatUser;

  @Output()
  userSentMessage: EventEmitter<any> = new EventEmitter<any>();

  @Output() userUpdated: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('messagesDiv')
  conversationDiv: ElementRef;

  constructor() {}

  ngOnInit() {}

  scrollToBottom() {
    setTimeout(() => {
      this.conversationDiv.nativeElement.scrollTop = this.conversationDiv.nativeElement.scrollHeight;
    }, 10);
  }

  onMessageSent(message) {
    this.userSentMessage.emit(message);
  }

  onUserUpdated(data) {
    this.userUpdated.emit(data);
  }
}
