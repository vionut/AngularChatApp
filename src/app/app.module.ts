import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from "ng2-semantic-ui";
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { ChannelsComponent } from './chat/channels/channels.component';
import { ConversationsComponent } from './chat/conversations/conversations.component';
import { DirectoryComponent } from './chat/directory/directory.component';
import { HeaderComponent } from './chat/chat-window/header/header.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { MessageComponent } from './chat/chat-window/message/message.component';
import { FooterComponent } from './chat/chat-window/footer/footer.component';
import { AdminTableComponent } from './admin-table/admin-table.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SendBirdService } from './sendbird.service';
import { CheckPasswordDirective } from './sign-up/check-password.directive';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChannelsComponent,
    ConversationsComponent,
    DirectoryComponent,
    HeaderComponent,
    ChatWindowComponent,
    MessageComponent,
    FooterComponent,
    AdminTableComponent,
    SignUpComponent,
    SignInComponent,
    NavbarComponent,
    CheckPasswordDirective
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpModule, HttpClientModule, SuiModule],
  providers: [DataService, AuthGuardService, AuthService, SendBirdService, CheckPasswordDirective],
  bootstrap: [AppComponent]
})
export class AppModule {}
