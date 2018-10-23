import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as SendBird from 'sendbird';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

const APP_ID = '1BD11D57-18D2-4226-8ABA-17DDCDCB26FD';

@Injectable({
  providedIn: 'root'
})
export class SendBirdService {
  sbClient;
  token;
  user_id;
  tokenHelper = new JwtHelperService();

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
    };
    this.sbClient.addChannelHandler("message received", channelHandler);
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

  sendMessageToOpenChannel(channel, message) {
    if (!message.attachments) {
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
  }
}
