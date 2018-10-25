import { Injectable } from '@angular/core';
import * as SendBird from 'sendbird';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';

const APP_ID = '1BD11D57-18D2-4226-8ABA-17DDCDCB26FD';

@Injectable({
  providedIn: 'root'
})
export class SendBirdService {
  sbClient;
  token;
  user_id;
  tokenHelper = new JwtHelperService();
  private _messageReceivedThroughHandler: Subject<any> = new Subject<any>();
  get messageReceivedThroughHandler() {
    return this._messageReceivedThroughHandler.asObservable();
  }

  private _messageUpdatedThroughtHandler: Subject<any> = new Subject<any>();
  get messageUpdatedThroughtHandler() {
    return this._messageUpdatedThroughtHandler.asObservable();
  }

  private _messageDeletedThroughHandler: Subject<any> = new Subject<any>();
  get messageDeletedThroughHandler() {
    return this._messageDeletedThroughHandler.asObservable();
  }

  constructor() {
    this.token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    this.user_id = this.token ? this.tokenHelper.decodeToken(this.token).user._id : null;
    this.sbClient = new SendBird({ appId: APP_ID });
    this.createChannelHandlers();
  }

  createChannelHandlers() {
    let channelHandler = new this.sbClient.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {
      console.log(channel, message);
      this._messageReceivedThroughHandler.next({ channel, message });
    };
    channelHandler.onMessageUpdated = (channel, message) => {
      console.log(channel, message);
      this._messageUpdatedThroughtHandler.next({ channel, message });
    };
    channelHandler.onMessageDeleted = (channel, messageId) => {
      console.log(channel, messageId);
      this._messageDeletedThroughHandler.next({ channel, messageId });
    };
    this.sbClient.addChannelHandler('messages', channelHandler);
  }

  connectToSb() {
    return new Observable(observer => {
      this.sbClient.connect(
        this.user_id,
        (user, error) => {
          if (error) {
            observer.error({ ...error, message: "Couldn't connect to sendbird" });
          }
          observer.next(user);
          observer.complete();
        }
      );
    });
  }

  getAllChatUsers() {
    const query = this.sbClient.createUserListQuery();
    return new Observable(observer => {
      query.next((users, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't get all users" });
        }
        observer.next(users);
        observer.complete();
      });
    });
  }

  getOpenChannels() {
    const openChannelListQuery = this.sbClient.OpenChannel.createOpenChannelListQuery();
    return new Observable(observer => {
      openChannelListQuery.next((channels, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't get open channels" });
        }
        observer.next(channels);
        observer.complete();
      });
    });
  }

  getGroupChannels() {
    const channelListQuery = this.sbClient.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.includeEmpty = true;
    return new Observable(observer => {
      if (channelListQuery.hasNext) {
        channelListQuery.next((channelList, error) => {
          if (error) {
            observer.error({ ...error, message: "Couldn't get group channels" });
          }
          observer.next(channelList);
          observer.complete();
        });
      }
    });
  }

  enterOpenChannel(channelUrl) {
    return new Observable(observer => {
      this.sbClient.OpenChannel.getChannel(channelUrl, (channel, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't find channel" });
        }
        channel.enter((response, error) => {
          if (error) {
            observer.error({ ...error, message: "Couldn't enter channel" });
          }
          observer.next(channel);
          observer.complete();
        });
      });
    });
  }

  loadChannelMessages(channel) {
    const messageListQuery = channel.createPreviousMessageListQuery();
    return new Observable(observer => {
      messageListQuery.load(100, true, (messageList, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't load channel messages" });
        }
        observer.next(messageList.reverse());
        observer.complete();
      });
    });
  }

  sendMessageToChannel(channel, message) {
    return new Observable(observer => {
      channel.sendUserMessage(message, (message, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't send message" });
        }
        observer.next(message);
        observer.complete();
      });
    });
  }

  sendFileMessageToChannel(channel, file) {
    return new Observable(observer => {
      channel.sendFileMessage(file, (message, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't send message" });
        }
        observer.next(message);
        observer.complete();
      });
    });
  }

  getChannelUsers(channel) {
    const participantListQuery = channel.createParticipantListQuery();
    return new Observable(observer => {
      participantListQuery.next((participantList, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't get message users" });
        }
        observer.next(participantList);
        observer.complete();
      });
    });
  }

  createConversation(otherId, id) {
    return new Observable(observer => {
      this.sbClient.GroupChannel.createChannelWithUserIds(
        [id, otherId],
        true,
        (conversation, error) => {
          if (error) {
            observer.error({ ...error, message: "Couldn't create conversation" });
          }
          this.sbClient.GroupChannel.getChannel(conversation.url, (groupChannel, error) => {
            if (error || !groupChannel) {
              observer.next({ conversation, isNew: true });
            }
            observer.next({ conversation, isNew: false });
            observer.complete();
          });
        }
      );
    });
  }

  updateUserProfile(nickname, avatar) {
    return new Observable(observer => {
      this.sbClient.updateCurrentUserInfo(nickname, avatar, (response, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't update user profile" });
        }
        observer.next({ response, message: 'Updated user profile' });
        observer.complete();
      });
    });
  }

  updateMessage(channel, messageId, newMessage) {
    return new Observable(observer => {
      channel.updateUserMessage(messageId, newMessage, null, null, (message, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't edit message" });
        }
        observer.next(message);
        observer.complete();
      });
    });
  }

  deleteMessage(channel, message) {
    return new Observable(observer => {
      channel.deleteMessage(message, (response, error) => {
        if (error) {
          observer.error({ ...error, message: "Couldn't delete message" });
        }
        observer.next(response);
        observer.complete();
      });
    });
  }
}
