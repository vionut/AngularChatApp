import { Component, OnInit } from '@angular/core';
import { SendBirdService } from 'src/app/sendbird.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  channels;

  constructor(public sendbirdService: SendBirdService) { }

  ngOnInit() {
  }

}
