import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readTime'
})
export class ReadTimePipe implements PipeTransform {

  transform(content: string): string {
    const wordsPerMinute = 200; // Average reading speed in words per minute
    const words = content.split(/\s/g).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

}
