import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  loginAdmin(data: any){
    return this.http.post("http://localhost:3000/api/1/login", data);
  }

  getBlogList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userAuthToken')}`
      })
    }

    return this.http.get('http://localhost:3000/api/1/blog', httpOptions);
  }

  insertBlog(data: any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userAuthToken')}`
      })
    }

    const formData = new FormData();
    formData.append('blogImage', data.blogImage);
    formData.append('blogName', data.blogName);
    formData.append('blogSlug', data.blogSlug);
    formData.append('blogDescription', data.blogDescription);

    return this.http.post('http://localhost:3000/api/1/blog', formData, httpOptions);
  }

  updateBlog(data: any, blogId: any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userAuthToken')}`
      })
    }

    return this.http.patch('http://localhost:3000/api/1/blog/'+blogId, data, httpOptions);
  }

  deleteBlog(blogId: any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userAuthToken')}`
      })
    }

    return this.http.delete('http://localhost:3000/api/1/blog/'+blogId, httpOptions);
  }

  pingServer(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('userAuthToken')}`
      })
    }

    return this.http.get('http://localhost:3000/api/1/ping', httpOptions);    
  }
}
