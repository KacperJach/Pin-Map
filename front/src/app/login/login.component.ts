import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {AuthStateService} from "../auth/auth-state.service";
import {LoginResponse} from "../shared/LoginResponse";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  loginFormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loginError = false;

  constructor(private router: Router,
              private authService: AuthService,
              private authStateService: AuthStateService,
              private snackBar: MatSnackBar) {
  }

  submit() {
    this.authService.login(
      this.loginFormGroup.controls.login.value!,
      this.loginFormGroup.controls.password.value!)
      .subscribe({
        next: (response: LoginResponse) => {
          if (response.logged_in) {
            this.authStateService.saveUserId(response.user_id);
            this.router.navigate(['home']);
            this.openSnackbar('Login successful');

          } else {
            this.loginError = true;
          }
        },
        error: err => {
          console.log(err);
          this.openSnackbar('Login failed. Try again later.');
        }
      });
  }

  openSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'end'
    });
  }
}
