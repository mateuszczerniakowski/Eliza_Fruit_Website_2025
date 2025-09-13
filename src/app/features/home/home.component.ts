import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { VideoOptimizationService } from '../../services/video-optimization.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslatePipe, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('backgroundVideo') videoRef!: ElementRef<HTMLVideoElement>;
  
  private isSlowConnection = false;

  constructor(private videoOptimizationService: VideoOptimizationService) {}

  ngAfterViewInit() {
    // Check connection speed and device capabilities
    this.detectConnectionSpeed();
    
    const video = this.videoRef.nativeElement;
    
    // Optimize video loading based on connection
    this.optimizeVideoLoading(video);
    
    // Add event listeners for smooth transitions
    video.addEventListener('loadeddata', () => {
      video.setAttribute('data-loaded', 'true');
    });
    video.addEventListener('canplay', () => {
      video.setAttribute('data-loaded', 'true');
    });
    
    // Force video to play
    video.muted = true; // Required for autoplay in most browsers
    video.playsInline = true; // Required for mobile devices
    
    // Attempt to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Video is playing successfully
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

  private detectConnectionSpeed() {
    // Check Network Information API if available
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    if (connection) {
      // Mark as slow connection if effective type is slow-2g or 2g
      this.isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.saveData === true;
    }
    
    // Fallback: Check if device is mobile (often has slower connections)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && !connection) {
      this.isSlowConnection = true;
    }
  }

  private optimizeVideoLoading(video: HTMLVideoElement) {
    if (this.isSlowConnection) {
      // For slow connections, prefer smaller videos and lazy loading
      video.preload = 'none';
      
      // Remove higher quality sources for slow connections
      const sources = video.querySelectorAll('source');
      sources.forEach((source, index) => {
        const src = source.getAttribute('src');
        if (src && (src.includes('1080p') || src.includes('4K'))) {
          // Remove high quality sources on slow connections
          source.remove();
        }
      });
    } else {
      // Fast connection - preload metadata for smooth experience
      video.preload = 'metadata';
    }
    
    // Add loading optimization
    video.addEventListener('loadstart', () => {
      console.log('Video loading started');
    });
    
    video.addEventListener('canplay', () => {
      console.log('Video can start playing');
    });
  }
}
