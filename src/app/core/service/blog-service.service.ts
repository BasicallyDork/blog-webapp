import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Blog } from '../models/blog';
import { environment } from 'src/environments/environment';
import { Comments } from '../models/comments';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  _url = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getBlogs():Observable<Blog[]>{
    return this.http.get<Blog[]>(this._url+'/posts')
  }
  getSingleBlog(slug: string): Observable<Blog[]> {
    let queryParams = new HttpParams().append("slug",slug);
    return this.http.get<Blog[]>(this._url+'/posts',{params : queryParams});
  }
  getBlogComments(id: number):Observable<Comments[]> {
    let queryParams = new HttpParams().append("postId",id);
    return this.http.get<Comments[]>(this._url+'/comments',{params : queryParams});
  }
  addBlogComment(data: any):Observable<any> {
    return this.http.post(this._url+'/comments',data);
  }
}
