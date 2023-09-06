import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username:any;
  password:any;
  loginError:boolean = false;
  
  constructor(public apiService: ApiService, public router: Router) {}

  ngOnInit(){
    if(localStorage.getItem('userAuthToken')){
      this.router.navigate(['dashboard']);
    }
  }

  loginUser(){
    this.apiService.loginAdmin({
      username: this.username,
      password: this.password
    }).subscribe((res: any) => {
      if(res.token){
        localStorage.removeItem('userAuthToken');
        localStorage.setItem('userAuthToken', res.token);
        this.router.navigate(['dashboard']);
      }
    }, (err) => {
      this.loginError = true;
      setTimeout(()=>{
        this.loginError = false;
      },3000);
    })
  }
}
