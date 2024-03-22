import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from 'src/app/core/service/blog-service.service';
import { CommonService } from 'src/app/core/service/common.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
})
export class BlogPageComponent implements OnInit {
  url: any;
  Id: any;
  comments: any;
  isSubmitting: boolean = true;
  singleBlog: any;
  commentForm!: FormGroup
  currentDate: Date = new Date();
  constructor(private fb: FormBuilder, private _bs: BlogService, private route: ActivatedRoute, private titleService: Title, private metaTagService: Meta, private _ccs: CommonService, private cdr: ChangeDetectorRef) {
    // this.sortBlogsByDate();
   }

  ngOnInit(): void {
    this.url = this.route.snapshot.params['id'];
    this._bs.getSingleBlog(this.url)
      .subscribe(
        data => {
          this.singleBlog = data
          // data.map(r => {
          //   this._bs.getBlogComments(r.id)
          //   .subscribe(
          //     commentData => {
          //       this.comments = commentData
          //   }
          //   )
          //   console.log(r.id)
          //   this.Id = r.id
          // })
          data.forEach(element => { 
            this._bs.getBlogComments(element.id)
            .subscribe(
              commentData => {
                this.comments = commentData
            }
            )
            this.Id = element.id
            // console.log(this.Id)
            this.commentForm.controls.postId.setValue(element.id)
          })
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

  get f() { return this.commentForm.controls; }

  
  addComment() {
    if (this.commentForm.invalid) return;

    this.isSubmitting = true;
    console.log(this.commentForm.value)
    this._bs.addBlogComment(this.commentForm.value)
      .subscribe(r => {
        this.loadComments();
        this.commentForm.reset()
        // window.dialog.close()
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
    // Assuming you have a method in your blog service to fetch comments
    this._bs.getBlogComments(this.Id).subscribe(comments => {
      this.comments = comments;
      // Trigger change detection after updating comments
      this.cdr.detectChanges();
    });
  }
}
