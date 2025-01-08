import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  registerForm!: FormGroup;

  exitoso = false;
  registroFallido = false;
  mensajeError = '';

  constructor(private fb: FormBuilder, private autenticacion: AuthService, private router: Router) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {return;}

    const {email, password, nombre} = this.registerForm.value;
    console.log(email+"::"+password);
    this.autenticacion.register(email, password, nombre).subscribe({
      next: data => {
        this.exitoso = true;
        this.registroFallido = false;

        console.log('REG_OK');
        this.router.navigate(['/login']);
        console.log('REG_OK');
      },
      error: err => {
        console.log('REG_ERR');
        console.log(err);
        this.mensajeError = err.console.error.message;
        this.registroFallido = true;
      }
    });
  }

}
