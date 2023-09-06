import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

interface blogItemType{
  id: number,
  blogImage: string,
  blogName: string,
  blogSlug: string,
  blogDescription: string,
  _id: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  page:number = 1;
  pageSize:number = 10;
  blogData:blogItemType[] = [];
  blogName:string = '';
  blogSlug:string = '';
  blogDescription:string = '';
  blogImage:any;
  editBlogDetials:any;
  deleteBlogId:string='';

  constructor(public apiService: ApiService, public modalService: NgbModal,public _router: Router){}

  ngOnInit(){
    this.fetchBlogs();

    setInterval(()=>{
      this.apiService.pingServer().subscribe((res)=>{

      },(err)=>{
        localStorage.removeItem('userAuthToken');
        this._router.navigate(['login']);
      })
    },60000)
  }

  fetchBlogs(){
    let _self = this;
    this.apiService.getBlogList().subscribe((res: any)=>{
      _self.blogData = [];
      res.data.forEach(function(blogItem: any, index: number){
        let blog = blogItem;
        blog.id = index+1;
        _self.blogData.push(blog);
      })
    }, (err) => {
      console.log(err);
    })
  }

  verifyBlogSlug(event: any){
    if(!(/^(\d|\w|-)+$/.test(event.target.value))){
      event.target.value = '';
    }
  }

  onFileSelected(event: any){
    this.blogImage = event.target.files[0];
  }

  open(modal: any, mode:string = '', blogId: string = ''){
    let _self = this;
    if(mode == 'Edit'){
      this.blogData.forEach(function(blog:any){
        if(blog._id == blogId){
          _self.editBlogDetials = blog;
        }
      })
    } else if (mode == 'Delete'){
      this.deleteBlogId = blogId;
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' });
  }

  insertBlog(){
    this.apiService.insertBlog({
      blogName: this.blogName,
      blogSlug: this.blogSlug,
      blogDescription: this.blogDescription,
      blogImage: this.blogImage
    }).subscribe((res: any)=>{
      this.blogImage = '';
      this.blogName = '';
      this.blogDescription = '';
      this.blogSlug = '';
      this.fetchBlogs();
    },(err)=>{
      console.log(err);
    })
  }

  updateBlog(){
    this.apiService.updateBlog({
      blogName: this.editBlogDetials.blogName,
      blogSlug: this.editBlogDetials.blogSlug,
      blogDescription: this.editBlogDetials.blogDescription
    }, this.editBlogDetials._id).subscribe((res:any)=>{
      this.editBlogDetials = {};
      this.fetchBlogs();
    },(err)=>{
      console.log(err)
    })
  }

  deleteBlog(){
    this.apiService.deleteBlog(this.deleteBlogId).subscribe((res:any)=>{
      this.deleteBlogId = '';
      this.fetchBlogs();
    },(err)=>{
      console.log(err);
    })
  }

  logoutAdmin(){
    localStorage.removeItem('userAuthToken');
    this._router.navigate(['login'])
  }

}
