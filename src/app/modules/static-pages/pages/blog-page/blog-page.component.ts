import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from 'src/app/core/service/blog-service.service';
import { CommonService } from 'src/app/core/service/common.service';
import { formatDate } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [ // ':enter' is an alias for 'void => *'
        animate('0.5s ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class BlogPageComponent implements OnInit {
  url: any;
  post_Id: any;
  comments: any;
  singleBlog: any;
  commentForm!: FormGroup
  currentDate: Date = new Date();
  constructor(private fb: FormBuilder, private _bs: BlogService, private route: ActivatedRoute, private titleService: Title, private metaTagService: Meta, private _ccs: CommonService, private cdr: ChangeDetectorRef) {

   }

  ngOnInit(): void {
    this.url = this.route.snapshot.params['id'];
 
    this._bs.getSingleBlog(this.url)
      .subscribe(
        data => {
          this.singleBlog = data
          this.post_Id=this.singleBlog[0].id
            this._bs.getBlogComments(this.post_Id)
            .subscribe(
              commentData => {
                this.comments = commentData
            })
            this.loadCommentForm(this.post_Id)
          
      }
    )
    this.commentForm = this.fb.group({
      user:['',[Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(3)]],
      id: Math.floor(Math.random() * 500),
      postId: '',
      parent_id: null,
      date: formatDate(this.currentDate,'yyyy-MM-dd',"en-US")
    })
    // -------------FOR SEO--------------------
    // const page_id = {page_id : "BLOG_PAGE"}
    // this._ccs.getSeoByPage(page_id)
    // .subscribe(
    //   data => {
    //     this.setSEOParam(data[0]);
    //   }
    // )
  }
  loadCommentForm(postID: any){
    this.commentForm = this.fb.group({
      user:['',[Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(3)]],
      id: Math.floor(Math.random() * 500000),
      postId: postID,
      parent_id: null,
      date: formatDate(this.currentDate,'yyyy-MM-dd',"en-US")
    })
  }
  get f() { return this.commentForm.controls; }

  
  addComment() {
    if (this.commentForm.invalid) return;
    this._bs.addBlogComment(this.commentForm.value)
      .subscribe(r => {
        this.commentForm.get('user')?.reset() ?? console.warn('User control not found');
        this.commentForm.get('content')?.reset() ?? console.warn('Content control not found');
        this.commentForm.get('id')?.setValue(Math.floor(Math.random() * 500000)) ?? console.warn('ID control not found');
        this.loadComments();
    })
  }
// ------------------FOR SEO--------------------
  setSEOParam(data: { title: string; google_tags: { meta_keywords: any; meta_description: any; }; }){
    this.titleService.setTitle(data.title);
    this.metaTagService.addTags([
      { name: 'keywords', content: data.google_tags.meta_keywords},
      { name: 'description', content: data.google_tags.meta_description },
      { charset: 'UTF-8' }
    ]);
  }
  loadComments() {
    this._bs.getBlogComments(this.post_Id).subscribe(comments => {
      this.comments = comments;
      this.cdr.detectChanges();
    });
  }
}
