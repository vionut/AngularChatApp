import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { ModalTemplate, SuiModalService, TemplateModalConfig, ModalSize } from 'ng2-semantic-ui';
import { NgForm } from '@angular/forms';

export interface IUserDetailsModalContext {
  user: {
    id: '';
    firstName: '';
    lastName: '';
    role: '';
    email: '';
  };
}
@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnInit {
  users;
  loading = false;

  subs: Subscription[] = [];

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<IUserDetailsModalContext, string, string>;

  constructor(public dataService: DataService, public modalService: SuiModalService) {}

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  init() {
    const getUsersSub = this.dataService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data.response.users;
      },
      error => {
        console.log(error);
      }
    );
    this.subs.push(getUsersSub);
  }

  openUserModal(index) {
    const userToEdit = this.users[index];
    const config = new TemplateModalConfig<IUserDetailsModalContext, string, string>(
      this.modalTemplate
    );

    config.closeResult = 'closed!';
    config.size = ModalSize.Normal;
    config.context = {
      user: {
        id: userToEdit._id,
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        role: userToEdit.role
      }
    };
    console.log(config.context);

    this.modalService
      .open(config)
      .onApprove(result => {
        console.log(result);
      })
      .onDeny(result => {
        console.log(result);
      });
  }

  onDeleteUser(id, modal) {
    this.loading = true;
    const deleteUserSub = this.dataService.deleteUser(id).subscribe(
      data => {
        const index = this.users.findIndex(u => u._id === id);
        const newUsersArray = this.users.slice();
        newUsersArray.splice(index, 1);
        this.users = newUsersArray;
        this.loading = false;
        modal.approve('User Deleted');
      },
      error => {
        console.log(error);
        this.loading = false;
        modal.deny('Error deleting user');
      }
    );
    this.subs.push(deleteUserSub);
  }

  onEditUser(id, role, form: NgForm, modal) {
    console.log(id);
    this.loading = true;
    const newUser = {};
    newUser['id'] = id;
    newUser['firstName'] = form.controls['firstName'].value;
    newUser['lastName'] = form.controls['lastName'].value;
    newUser['email'] = form.controls['email'].value;
    newUser['role'] = role;
    const editUserSub = this.dataService.editUser(newUser).subscribe(
      data => {
        // need to see if on sendbird we can delete the user
        const index = this.users.findIndex(u => u._id === id);
        this.users[index].firstName = newUser['firstName'];
        this.users[index].lastName = newUser['lastName'];
        this.users[index].email = newUser['email'];
        this.users[index].role = newUser['role'];
        this.loading = false;
        modal.approve('User Updated');
      },
      error => {
        console.log(error);
        this.loading = false;
        modal.deny('Error updateing user');
      }
    );
    this.subs.push(editUserSub);
  }
}
