import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { LoginService } from './login.service';

interface User {
    name: string;
    email: string;
}

@Component({
    selector: 'users',
    templateUrl: './user.component.html'
})
export class UserComponent {
    usersCol: AngularFirestoreCollection<User>;
    users: any;

    constructor(private afs: AngularFirestore, private _router: Router, private _loginService: LoginService) {
    }
    
    ngOnInit() {
        this.usersCol = this.afs.collection('users/' +  this._loginService.loggedInUser + '/clients'); 
        this.users = this.usersCol.snapshotChanges()
            .pipe(
                map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data() as User;
                        const id = a.payload.doc.id;
                        return { id, data };
                    });
                })
            );
    }

    add() {
        this._router.navigate(['add']);
    }

    delete(userId,name){
        if (confirm("Are you sure you want to delete " + name + "?")){ 
            this.afs.doc('users/'+ this._loginService.loggedInUser+"/clients/"+userId).delete();
        }
    }
}
