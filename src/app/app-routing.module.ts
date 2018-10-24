import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { RoleGuardService as RoleGuard } from './role-guard.service';
import { ChatComponent } from './chat/chat.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AdminTableComponent } from './admin-table/admin-table.component';

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'admin-panel', component: AdminTableComponent, canActivate: [AuthGuard, RoleGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
