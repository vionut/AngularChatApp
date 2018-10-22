import { Component, OnInit } from '@angular/core';
import { SendBirdService } from '../sendbird.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  loading = true;
  chatUser;

  constructor(public sendbirdService: SendBirdService) { }

  ngOnInit() {
    this.sendbirdService.connectToSb().subscribe(data => {
      this.chatUser = data;
      this.loading = false;
    }, error => {
      console.log(error);
    })
  }

}
