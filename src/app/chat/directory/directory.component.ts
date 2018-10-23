import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  @Input() chatUsers;
  @Input() channelUsers;
  @Input() chatUser;

  constructor() { }

  ngOnInit() {
  }

}
