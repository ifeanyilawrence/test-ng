import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from "../model/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: User;

  constructor(private router: Router, private ngZone: NgZone, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['/editor']);
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  public oAuthProvider(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((res) => {
        this.ngZone.run(() => {
          this.router.navigate(['/editor']);
        })
      }).catch((error) => {
        window.alert(error)
      })
  }

  public signinWithGoogle() {
    return this.oAuthProvider(new auth.GoogleAuthProvider())
      .then(res => {
        console.log(`Successfully logged in! ${res}`)
        this.router.navigate(['/editor']);
      }).catch(error => {
        console.log(error)
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  public getUser(): User {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  public signOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.setItem('user', null);
      this.router.navigate(['login']);
    })
  }
}