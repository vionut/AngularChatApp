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
  }

  connectToSb() {
    return new Observable(observer => {
      this.sbClient.connect(
        this.user_id,
        (user, error) => {
          if (error) {
            observer.error(error);
          }
          observer.next(user);
          observer.complete();
        }
      );
    });
  }

  getOpenChannels() {
    const openChannelListQuery = this.sbClient.OpenChannel.createOpenChannelListQuery();
    openChannelListQuery.next((channels, error) => {
      if (error) {
        console.log(error);
        return error;
      }
      console.log(channels);
      return channels;
    });
  }
}
