import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardGroupComponent, ContainerComponent, InputGroupComponent, InputGroupTextDirective } from "@coreui/angular";
import { IconComponent, IconDirective } from "@coreui/icons-angular";
import { formImports, sharedImports } from "../../shared/imports/shared-imports";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = '';
  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const rawForm = this.registerForm.getRawValue();
    this.authService.register(rawForm.email, rawForm.username, rawForm.password).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
