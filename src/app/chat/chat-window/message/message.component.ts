import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import * as moment from 'moment';
import { SendBirdService } from '../../../sendbird.service';
import { Subscription } from 'rxjs';
import { ModalTemplate, SuiModalService, TemplateModalConfig, ModalSize } from 'ng2-semantic-ui';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()
  message;
  @Input()
  chatUser;
  @Input()
  currentChannel;
  @ViewChild('messageTextarea')
  messageTextarea: ElementRef;
  @Output()
  messageEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  messageDeleted: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<null, string, string>;

  subs: Subscription[] = [];

  isEditVisible = false;
  editingMessage = false;

  isDeleteVisible = false;

  constructor(public sendbirdService: SendBirdService, public modalService:SuiModalService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  openImageModal() {
    const config = new TemplateModalConfig<null, string, string>(this.modalTemplate);

    config.size=ModalSize.Mini;
    this.modalService.open(config);
  }

  getDateFromMoment(momentObj) {
    const now = moment(Date.now());
    const diffInDays = now.diff(momentObj, 'days');
    if (diffInDays >= 1) {
      return `${diffInDays} days ago, ${moment(momentObj).format('HH:mm')}`;
    }
    return moment(momentObj).format('HH:mm');
  }

  editMessage() {
    const newMessage = this.messageTextarea.nativeElement.value;
    if (newMessage === this.message.message) {
      this.editingMessage = false;
      return;
    }
    if (newMessage === '') {
      this.deleteMessage();
      return;
    }
    const updateMessageSub = this.sendbirdService
      .updateMessage(this.currentChannel, this.message.messageId, newMessage)
      .subscribe(
        data => {
          this.messageEdited.emit(data);
        },
        error => {
          console.log(error);
        },
        () => {
          this.editingMessage = false;
        }
      );
    this.subs.push(updateMessageSub);
  }

  deleteMessage() {
    const deleteMessageSub = this.sendbirdService
      .deleteMessage(this.currentChannel, this.message)
      .subscribe(
        data => {
          this.messageDeleted.emit();
        },
        error => {
          console.log(error);
        }
      );
    this.subs.push(deleteMessageSub);
  }
}
