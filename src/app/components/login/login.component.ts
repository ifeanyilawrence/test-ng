import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.max(4)])],
      email: ['', Validators.required]
    });
  } 

  ngOnInit() {
  }

  login() {
    this.authService.signinWithGoogle();
  }
}
