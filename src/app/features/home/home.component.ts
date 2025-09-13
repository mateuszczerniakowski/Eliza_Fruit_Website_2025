import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslatePipe, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('backgroundVideo') videoRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    // Ensure video plays after view initialization
    const video = this.videoRef.nativeElement;
    
    // Force video to play
    video.muted = true; // Required for autoplay in most browsers
    video.playsInline = true; // Required for mobile devices
    
    // Attempt to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video is playing successfully');
        })
        .catch(error => {
          console.error('Video autoplay failed:', error);
          // If autoplay fails, try to play on user interaction
          this.setupUserInteractionPlay(video);
        });
    }

    // Ensure video loops properly
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play();
    });
  }

  private setupUserInteractionPlay(video: HTMLVideoElement) {
    const playOnInteraction = () => {
      video.play();
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);
  }
}
