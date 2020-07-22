import { Component, OnInit } from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { User } from './model/user';
import { SignalRService } from './signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-editor';

  displayMessage: string;
  user: User;

  constructor(private loadingBar: SlimLoadingBarService, private router: Router, private authService: AuthService,
              private signalRService: SignalRService) {
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this.loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this.loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this.loadingBar.stop();
    }
  }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addOrderResponseListener();

    // this.checkAuth();
  }

  private checkAuth() {
    if ( this.authService.isLoggedIn ) {
      this.user = this.authService.getUser();
      this.displayMessage = `${this.user.displayName}!`;
      this.router.navigate(['editor']);
    }
  }

  logout() {
    this.authService.signOut();
  }
}
