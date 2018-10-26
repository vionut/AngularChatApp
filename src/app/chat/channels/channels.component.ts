import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SendBirdService } from 'src/app/sendbird.service';
import { Subscription } from 'rxjs';
import { SuiModalService, TemplateModalConfig, ModalTemplate, ModalSize } from 'ng2-semantic-ui';

export interface IGroupModalContext {
  data: any;
}

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  @Input()
  channels;
  @Input()
  groups;
  @Input()
  chatUser;
  @Input()
  currentChannel;
  @Input()
  chatUsers;
  @Output()
  channelEntered: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  channelClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  groupClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  createGroupClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  groupCreated: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<IGroupModalContext, string, string>;

  showDiscardUser = false;
  newGroupParticipants = [];

  subs: Subscription[] = [];

  constructor(public sendbirdService: SendBirdService, public modalService: SuiModalService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  openCreateGroupModal() {
    const config = new TemplateModalConfig<IGroupModalContext, string, string>(this.modalTemplate);

    config.closeResult = 'closed';
    const context = this.chatUsers.slice();
    context.splice(context.indexOf(this.chatUser), 1);

    config.context = { data: context };
    config.size = ModalSize.Normal;

    this.modalService
      .open(config)
      .onApprove(result => {
        console.log(result);
      })
      .onDeny(result => console.log(result));
  }

  createGroupChat(modal) {
    modal.approve("Create group clicked");
    this.createGroupClicked.emit(this.newGroupParticipants);
    const ids = [];
    this.newGroupParticipants.forEach(p => {
      ids.push(p.userId);
    });
    const createGroupSub = this.sendbirdService.createConversation(ids).subscribe(
      data => {
        console.log(data);
        this.groupCreated.emit(data);
      },
      error => {
        console.log(error);
      }
    )
    this.subs.push(createGroupSub);
  }

  onItemDrop(e, context) {
    this.newGroupParticipants.push(e.dragData);
    context.splice(context.indexOf(e.dragData), 1);
  }

  removeNewParticipant(index, context) {
    context.push(this.newGroupParticipants[index]);
    const newParticipantsArray = this.newGroupParticipants.slice();
    newParticipantsArray.splice(index, 1);
    this.newGroupParticipants = newParticipantsArray;
  }

  enterOpenChannel(index) {
    this.channelClicked.emit(this.channels[index]);
    const channelUrl = this.channels[index].url;
    const enterChannelSub = this.sendbirdService.enterOpenChannel(channelUrl).subscribe(
      data => {
        this.channelEntered.emit(data);
        this.newGroupParticipants = [];
      },
      error => {
        this.channelEntered.emit({ channel: this.channels[index], error: error.message });
        this.newGroupParticipants= [];
      }
    );
    this.subs.push(enterChannelSub);
  }
}
