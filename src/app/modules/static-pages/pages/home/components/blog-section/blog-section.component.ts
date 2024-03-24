import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/core/models/blog';
import { BlogService } from 'src/app/core/service/blog-service.service';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.scss']
})
export class BlogSectionComponent implements OnInit {

  filterName = [
    {
      title:'All'
    },
    {
      title:'Health'
    },
    {
      title:'Mobile'
    },
    {
      title:'Tech'
    },
  ]
  blogs : Blog[] = [];
  selectedCategory: string = 'All';

  filterBlogs(category: string) {
    this.selectedCategory = category;
  }

  get filteredBlogs() {
    if (this.selectedCategory === 'All') {
      return this.blogs;
    } else {
      return this.blogs.filter(blog => blog?.category === this.selectedCategory);
    }
  }

  sortBlogsByDate() {
    this.blogs.sort((a, b) => {
      return new Date(a?.publish_date).getTime() - new Date(b?.publish_date).getTime();
    });
  }

  constructor(private blog_service:BlogService) { }

  ngOnInit(): void {
    this.blog_service.getBlogs()
      .subscribe(
        data => {
          this.blogs = data
          this.sortBlogsByDate()
      }
    )
  }

}
