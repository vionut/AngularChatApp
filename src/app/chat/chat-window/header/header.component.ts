import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { ModalTemplate, SuiModalService, TemplateModalConfig, ModalSize } from 'ng2-semantic-ui';
import { SendBirdService } from 'src/app/sendbird.service';
import { Subscription } from 'rxjs';

export interface IProfileModalContext {
  data: {
    nickname: string;
    imgSource: string;
  };
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input()
  chatUser;
  @Input()
  channel;
  @ViewChild('modalTemplate')
  modalTemplate: ModalTemplate<IProfileModalContext, string, string>;
  @ViewChild('avatarInput')
  avatarInput: ElementRef;
  @ViewChild('avatarImage')
  avatarImage: ElementRef;
  subs: Subscription[] = [];
  loading = false;
  @Output()
  userUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(public modalService: SuiModalService, public sendbirdService: SendBirdService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  openProfileModal() {
    const config = new TemplateModalConfig<IProfileModalContext, string, string>(
      this.modalTemplate
    );

    config.closeResult = 'closed!';
    config.size = ModalSize.Tiny;
    config.context = {
      data: { nickname: this.chatUser.nickname, imgSource: this.chatUser.profileUrl }
    };

    this.modalService
      .open(config)
      .onApprove(result => {
        console.log(result);
      })
      .onDeny(result => console.log(result));
  }

  uploadAvatar() {
    const input = this.avatarInput.nativeElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarImage.nativeElement.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSaveProfile(input, modal) {
    this.loading = true;
    const newNickname = input.value;
    const newAvatar =
      this.avatarImage.nativeElement.files && this.avatarImage.nativeElement.files[0];
    const updateProfileSub = this.sendbirdService
      .updateUserProfile(newNickname, newAvatar)
      .subscribe(
        data => {
          this.loading = false;
          this.userUpdated.emit(data);
        },
        error => {
          console.log(error);
        },
        () => {
          modal.approve('update profile clicked!');
        }
      );
    this.subs.push(updateProfileSub);
  }
}
