import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { StorageService } from 'src/app/servicios/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  loginForm!: FormGroup;
  sesionIniciada = false;
  loginFallido = false;
  mensajeError = '';
  nombre: string = '';

  constructor(private fb: FormBuilder, private autenticacion: AuthService, private storage: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    if (this.storage.esLogueado()) {
      this.sesionIniciada = true;
      this.nombre = this.storage.getUsuario().nombre;
      this.router.navigate(['/mi-app']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {return;}

    const {email, password} = this.loginForm.value;
    console.log('emailpassword');
    console.log(email+"::"+password);
    this.autenticacion.login(email,password).subscribe({
      next: data => {
        this.storage.setUsuario(data);
        this.loginFallido = false;
        this.sesionIniciada = true;
        this.nombre = this.storage.getUsuario().nombre;
        this.router.navigate(['/mi-app']);
      },
      error: err => {
        console.log('err');
        console.log(err);
        this.mensajeError = err.error.message;
        this.loginFallido = true;
      }
    });
  }

}
