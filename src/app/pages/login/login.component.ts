import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { formImports, sharedImports } from "../../shared/imports/shared-imports";
import { ToastrService } from "ngx-toastr";
import { CardGroupComponent, ContainerComponent, InputGroupComponent, InputGroupTextDirective } from "@coreui/angular";
import { IconComponent, IconDirective } from "@coreui/icons-angular";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ...sharedImports,
    ...formImports,
    IconComponent,
    IconDirective,
    ContainerComponent,
    CardGroupComponent,
    InputGroupTextDirective,
    InputGroupComponent,
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
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/user/purchase-product']);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error(this.errorMessage, 'Login Error');
      }
    })
  }
}
