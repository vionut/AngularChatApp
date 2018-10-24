import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SendBirdService } from 'src/app/sendbird.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  @Input() chatUsers;
  @Input() channelUsers;
  @Input() chatUser;

  @Output() userClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() conversationCreated: EventEmitter<any> = new EventEmitter<any>();
  subs: Subscription[] = [];

  constructor(public sendbirdService: SendBirdService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  openConversation(index) {
    this.userClicked.emit(this.chatUsers[index]);
    const otherId = this.chatUsers[index].userId;
    const id = this.chatUser.userId;
    const createConversationSub = this.sendbirdService.createConversation(otherId, id).subscribe(
      data => {
        console.log(data);
        this.conversationCreated.emit(data);
      },
      error => {
        console.log(error);
      }
    )
    this.subs.push(createConversationSub);

  }

}
