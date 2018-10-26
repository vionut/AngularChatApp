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
  groupChats: any[] = [];
  currentChannel;
  channelMessages: any[] = [];
  channelUsers: any[] = [];
  subs: Subscription[] = [];

  @ViewChild('chatWindow')
  chatWindow: ChatWindowComponent;

  constructor(public sendbirdService: SendBirdService) {
    const receiveMessageSub = this.sendbirdService.messageReceivedThroughHandler.subscribe(data => {
      if (this.currentChannel.url === data.channel.url) {
        this.addSentMessageToArray(data.message);
        return;
      }
      this.sendbirdService
        .sendMessageToChannel(data.channel, data.message)
        .subscribe((response: any) => {
          console.log('Succesfully sent message: ', response.message);
          console.log('To channel: ', response.channel);
        });
    });
    const updateMessageSub = sendbirdService.messageUpdatedThroughtHandler.subscribe(data => {
      const messageToUpdateIndex = this.channelMessages.findIndex(
        m => m.messageId === data.message.messageId
      );
      this.channelMessages.splice(messageToUpdateIndex, 1, data.message);
    });
    const deleteMessageSub = sendbirdService.messageDeletedThroughHandler.subscribe(data => {
      this.loadChannelMessages(this.currentChannel);
    });

    this.subs.push(receiveMessageSub);
    this.subs.push(updateMessageSub);
    this.subs.push(deleteMessageSub);
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

  userProfileUpdated(data) {
    this.channelUsers.splice(this.channelUsers.indexOf[this.chatUser], 1, data.response);
    this.allChatUsers.splice(this.allChatUsers.indexOf[this.chatUser], 1, data.response);
    this.chatUser = data.response;
  }

  userMessageUpdated(data) {
    this.channelMessages.splice(data.index, 1, data.message);
  }

  userMessageDeleted($event) {
    this.loadChannelMessages(this.currentChannel);
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
      (data: any) => {
        this.conversations = data;
        data.forEach(d => {
          if(d.members.length > 2) {
            this.groupChats.push(d);
          }
        })
        console.log('Succesfully retrieved list of conversations: ', this.conversations);
        console.log(this.groupChats);
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error.message);
      }
    );
    this.subs.push(getGroupChannelsSub);
  }

  onUserClicked(user) {
    this.loading = true;
    console.log('Trying to create conversation with user: ', user);
  }

  onConversationCreated(data) {
    this.loading = false;
    this.currentChannel = data.conversation;
    console.log('Successfully created channel: ', data.conversation);
    if (!this.conversations.find(e => e.url == data.conversation.url)) {
      this.conversations.push(data.conversation);
    }
    this.loadChannelMessages(data.conversation);
  }

  onChannelClicked(channel) {
    this.loading = true;
    console.log('Trying to enter channel: ', channel);
  }

  onCreateGroupClicked(participants) {
    this.loading = true;
    console.log("Trying to create conversation with: ", participants);
  }

  onGroupCreated(data) {
    if(data.error) {
      this.loading = false;
      console.log("Couldn't create group: ", data.channel);
      console.log('Error: ', data.error);
      return;
    }
    this.loading = false;
    this.currentChannel = data.conversation;
    console.log('Successfully created group: ', data.conversation);
    if(!this.groupChats) {
      this.groupChats.push(data.conversation);
    } else {
      if (!this.groupChats.find(e => e.url == data.conversation.url)) {
        this.groupChats.push(data.conversation);
      }
    }
    this.loadChannelMessages(data.conversation);
  }

  onGroupClicked(group) {
    this.currentChannel = group;
    console.log('Successfully entered group: ', group);
    this.loadChannelMessages(group);
    this.loadChannelUsers(group);
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
