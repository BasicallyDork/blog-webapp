import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BlogService } from "src/app/core/service/blog-service.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Comments } from "src/app/core/models/comments";
import { BlogPageComponent } from "./blog-page.component";

describe('BlogPageComponent',() => {

  let component: BlogPageComponent;
  let fixture: ComponentFixture<BlogPageComponent>;
  let blogService: jest.Mocked<BlogService>;
  

  beforeEach(async () => {
    // Mock BlogService
    const blogServiceMock = {
      getSingleBlog: jest.fn(),
      getBlogComments: jest.fn(),
      addBlogComment: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ BlogPageComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: BlogService, useValue: blogServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { 'id': 'test-id' } } }
        },
        // Mock other services
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignores unknown attributes and elements
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPageComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jest.Mocked<BlogService>;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  // More tests here
  test('ngOnInit should fetch single blog and its comments', (done) => {
    const mockBlog = {"id":1,"title":"test-title","category":"test-category","image":"test-link","author_image":"test-author-image","author":"test-author","publish_date":"test-date","slug":"test-slug","description":"test-description","content":"test-content"};
    const mockComments:Comments[] = [{"user":"test-user","content":"test-","id":5290,"postId":7,"parent_id":1234,"date":"2024-03-22"}];
    
    blogService.getSingleBlog.mockReturnValue(of([mockBlog]));
    blogService.getBlogComments.mockReturnValue(of(mockComments));
  
    fixture.detectChanges();
  
    component.ngOnInit();
  
    fixture.whenStable().then(() => {
      expect(blogService.getSingleBlog).toHaveBeenCalledWith('test-id');
      expect(blogService.getBlogComments).toHaveBeenCalledWith(1);
      expect(component.singleBlog).toEqual([mockBlog]);
      expect(component.comments).toEqual(mockComments);
      done();
    });
  });

  test('addComment should call addBlogComment when form is valid', () => {
    // Setup form with valid data
    component.commentForm.setValue({
      user: 'John Doe',
      content: 'This is a comment',
      id: 123,
      postId: 'test-id',
      parent_id: null,
      date: '2020-01-01'
    });
  
    const spy = jest.spyOn(blogService, 'addBlogComment').mockImplementation(() => of(null));
  
    component.addComment();
  
    expect(spy).toHaveBeenCalled();
  });

  test('addComment should not call addBlogComment when form is invalid', () => {
    // Make form invalid
    component.commentForm.controls['content'].setValue('');
  
    const spy = jest.spyOn(blogService, 'addBlogComment');
  
    component.addComment();
  
    expect(spy).not.toHaveBeenCalled();
  });
});