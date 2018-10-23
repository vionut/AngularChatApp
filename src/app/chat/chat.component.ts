import { Component, OnInit, ViewChild } from '@angular/core';
import { SendBirdService } from '../sendbird.service';
import { Subscription } from 'rxjs';
import { ChatWindowComponent } from './chat-window/chat-window.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  loading: boolean;
  chatUser;
  allChatUsers;
  openChannels;
  conversations;
  currentChannel;
  channelMessages: any[] = [];
  channelUsers: any[] = [];
  subs: Subscription[] = [];

  @ViewChild('chatWindow')
  chatWindow: ChatWindowComponent;

  constructor(public sendbirdService: SendBirdService) {
    const receiveMessageSub = this.sendbirdService.messageReceivedThroughHandler.subscribe(data => {
      if (data.channel.channelType === 'open') {
        if (this.currentChannel.url === data.channel.url) {
          this.addSentMessageToArray(data.message);
        }
        this.sendbirdService
          .sendMessageToOpenChannel(data.channel, data.message)
          .subscribe((response: any) => {
            console.log('Succesfully sent message: ', response.message);
            console.log('To channel: ', response.channel);
          });
      }
    });
    this.subs.push(receiveMessageSub);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  addSentMessageToArray(message) {
    this.channelMessages.push(message);
    this.chatWindow.scrollToBottom();
  }

  init() {
    this.loading = true;
    const chatConnectSub = this.sendbirdService.connectToSb().subscribe(
      data => {
        this.chatUser = data;
        console.log('User succesfully connected to sendbird: ', this.chatUser);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error.message);
      },
      () => {
        this.getAllChatUsers();
        this.getOpenChannels();
        this.getGroupChannls();
      }
    );
    this.subs.push(chatConnectSub);
  }

  getAllChatUsers() {
    this.loading = true;
    const getAllUsersSub = this.sendbirdService.getAllChatUsers().subscribe(
      data => {
        this.allChatUsers = data;
        console.log('Succesfully retrieved list of all users: ', this.allChatUsers);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error.message);
      }
    );
    this.subs.push(getAllUsersSub);
  }

  getOpenChannels() {
    this.loading = true;
    const getOpenChannelsSub = this.sendbirdService.getOpenChannels().subscribe(
      data => {
        this.openChannels = data;
        console.log('Succesfully retrieved list of open channels: ', this.openChannels);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error.message);
      }
    );
    this.subs.push(getOpenChannelsSub);
  }

  getGroupChannls() {
    this.loading = true;
    const getGroupChannelsSub = this.sendbirdService.getGroupChannels().subscribe(
      data => {
        this.conversations = data;
        console.log('Succesfully retrieved list of conversations: ', this.conversations);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error.message);
      }
    );
    this.subs.push(getGroupChannelsSub);
  }

  onChannelClicked(channel) {
    this.loading = true;
    console.log('Trying to enter channel: ', channel);
  }

  onChannelEntered(channel) {
    if (channel.error) {
      this.loading = false;
      console.log("Couldn't enter channel: ", channel.channel);
      console.log('Error: ', channel.error);
      return;
    }
    this.loading = false;
    this.currentChannel = channel;
    console.log('Successfully entered channel: ', channel);
    this.loadChannelMessages(channel);
    this.loadChannelUsers(channel);
  }

  loadChannelUsers(channel) {
    this.loading = true;
    const loadChannelUsersSub = this.sendbirdService.getChannelUsers(channel).subscribe(
      (data: any) => {
        this.channelUsers = data;
        this.loading = false;
        console.log('Successfully got channel users: ', this.channelUsers);
      },
      error => {
        this.loading = false;
        console.log(error.message);
      }
    );
    this.subs.push(loadChannelUsersSub);
  }

  loadChannelMessages(channel) {
    this.loading = true;
    const loadChannelMessagesSub = this.sendbirdService.loadChannelMessages(channel).subscribe(
      (data: any) => {
        this.loading = false;
        this.channelMessages = data;
        console.log('Successfully got channel messages: ', this.channelMessages);
        this.chatWindow.scrollToBottom();
      },
      error => {
        this.loading = false;
        console.log(error.message);
      }
    );
    this.subs.push(loadChannelMessagesSub);
  }
}
