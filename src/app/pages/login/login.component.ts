import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { sharedImports } from "../../shared/imports/shared-imports";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ...sharedImports,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    if (this.authService.login(username, password)) {
      this.toastr.success('Login successfully');
      // Navigate to dashboard or wherever needed
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid credentials. Please try again.';
    }
  }
}
