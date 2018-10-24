import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SendBirdService } from 'src/app/sendbird.service';
import { ConversationsComponent } from '../conversations/conversations.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  @Input()
  channels;
  @Input()
  chatUser;
  @Input()
  currentChannel;
  @Output()
  channelEntered: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  channelClicked: EventEmitter<any> = new EventEmitter<any>();
  subs: Subscription[] = [];

  constructor(public sendbirdService: SendBirdService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  enterOpenChannel(index) {
    this.channelClicked.emit(this.channels[index]);
    const channelUrl = this.channels[index].url;
    const enterChannelSub = this.sendbirdService.enterOpenChannel(channelUrl).subscribe(
      data => {
        this.channelEntered.emit(data);
      },
      error => {
        this.channelEntered.emit({ channel: this.channels[index], error: error.message });
      }
    );
    this.subs.push(enterChannelSub);
  }
}
