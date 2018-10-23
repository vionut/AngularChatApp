import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()
  message;

  constructor() {}

  ngOnInit() {}

  getDateFromMoment(momentObj) {
    const now = moment(Date.now());
    const diffInDays = now.diff(momentObj, 'days');
    if (diffInDays >= 1) {
      return `${diffInDays} days ago, ${moment(momentObj).format('HH:mm')}`;
    }
    return moment(momentObj).format('HH:mm');
  }
}
