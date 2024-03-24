import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { HeroSectionComponent } from './pages/home/components/herosection/herosection.component';
import { BlogSectionComponent } from './pages/home/components/blog-section/blog-section.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { ReadTimePipe } from 'src/app/pipes/read-time.pipe';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    HeroSectionComponent,
    BlogSectionComponent,
    BlogPageComponent,
    ReadTimePipe
  ],
  imports: [
    CommonModule,
    StaticPagesRoutingModule,
    ReactiveFormsModule
  ]
})
export class StaticPagesModule { }
