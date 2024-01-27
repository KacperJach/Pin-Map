import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterResponse} from "../shared/RegisterResponse";
import {passwordMatchingValidatior} from "../validators/PasswordMatchingValidator";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  registerFormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('',Validators.required),
    repeatPassword: new FormControl('', Validators.required),
  },{ validators: passwordMatchingValidatior });

  registerError = false;
  registerErrorMsg = '';

  constructor(private router: Router,
              private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  submit() {
    this.authService.register(
      this.registerFormGroup.controls.login.value!,
      this.registerFormGroup.controls.password.value!)
      .subscribe({
        next: (response: RegisterResponse) => {
          if (response.register) {
            this.router.navigate(['login']);
            this.openSnackbar('Registration successful');
          } else {
            this.registerError = true;
            this.registerErrorMsg = response.msg;
          }
        },
        error: err => {
          console.log(err);
          this.openSnackbar('Registration failed. Try again later.');
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
