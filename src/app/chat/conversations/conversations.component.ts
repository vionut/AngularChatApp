import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {
  @Input() chatUser;
  @Input() conversations;

  constructor() { }

  ngOnInit() {
  }

}
