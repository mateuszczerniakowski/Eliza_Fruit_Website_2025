import { Injectable } from '@angular/core';

export interface VideoQuality {
  width: number;
  height: number;
  src: string;
  format: 'webm' | 'mp4';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  estimatedSize: number; // in MB
}

@Injectable({
  providedIn: 'root'
})
export class VideoOptimizationService {
  
  private readonly videoQualities: VideoQuality[] = [
    // WebM versions (better compression)
    { width: 1280, height: 720, src: 'assets/videos/background_720p.webm', format: 'webm', quality: 'medium', estimatedSize: 3 },
    { width: 1920, height: 1080, src: 'assets/videos/background_1080p.webm', format: 'webm', quality: 'high', estimatedSize: 5 },
    
    // MP4 fallbacks
    { width: 1280, height: 720, src: 'assets/videos/background_720p.mp4', format: 'mp4', quality: 'medium', estimatedSize: 4 },
    { width: 1920, height: 1080, src: 'assets/videos/background_1080p.mp4', format: 'mp4', quality: 'high', estimatedSize: 7 },
    
    // Original as last resort
    { width: 3840, height: 2160, src: 'assets/videos/13896677_3840_2160_30fps.mp4', format: 'mp4', quality: 'ultra', estimatedSize: 56 }
  ];

  /**
   * Get optimal video quality based on device capabilities and connection
   */
  getOptimalVideoQuality(): VideoQuality[] {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width * devicePixelRatio;
    const connection = this.getConnectionInfo();
    
    let maxQuality: VideoQuality['quality'] = 'ultra';
    
    // Determine max quality based on connection
    if (connection.isSlowConnection) {
      maxQuality = 'medium';
    } else if (connection.effectiveType === '3g') {
      maxQuality = 'high';
    }
    
    // Filter based on screen size and connection
    const filteredQualities = this.videoQualities.filter(video => {
      // Don't serve higher resolution than screen can display
      if (video.width > screenWidth * 1.5) return false;
      
      // Respect connection-based quality limits
      const qualityOrder = { low: 0, medium: 1, high: 2, ultra: 3 };
      if (qualityOrder[video.quality] > qualityOrder[maxQuality]) return false;
      
      return true;
    });
    
    // Sort by format preference (WebM first) and quality
    return filteredQualities.sort((a, b) => {
      // Prefer WebM format
      if (a.format === 'webm' && b.format === 'mp4') return -1;
      if (a.format === 'mp4' && b.format === 'webm') return 1;
      
      // Then by quality
      const qualityOrder = { low: 0, medium: 1, high: 2, ultra: 3 };
      return qualityOrder[b.quality] - qualityOrder[a.quality];
    });
  }

  /**
   * Preload video with progressive enhancement
   */
  preloadVideo(videoElement: HTMLVideoElement, qualities: VideoQuality[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const loadVideo = (index: number) => {
        if (index >= qualities.length) {
          reject(new Error('No suitable video format found'));
          return;
        }
        
        const quality = qualities[index];
        const tempVideo = document.createElement('video');
        
        tempVideo.addEventListener('canplaythrough', () => {
          // Update the main video element sources
          this.updateVideoSources(videoElement, qualities.slice(index));
          resolve();
        }, { once: true });
        
        tempVideo.addEventListener('error', () => {
          // Try next quality
          loadVideo(index + 1);
        }, { once: true });
        
        tempVideo.src = quality.src;
        tempVideo.load();
      };
      
      loadVideo(0);
    });
  }

  private updateVideoSources(videoElement: HTMLVideoElement, qualities: VideoQuality[]) {
    // Clear existing sources
    const existingSources = videoElement.querySelectorAll('source');
    existingSources.forEach(source => source.remove());
    
    // Add optimized sources
    qualities.forEach(quality => {
      const source = document.createElement('source');
      source.src = quality.src;
      source.type = quality.format === 'webm' ? 'video/webm' : 'video/mp4';
      videoElement.appendChild(source);
    });
    
    videoElement.load();
  }

  private getConnectionInfo() {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    return {
      effectiveType: connection?.effectiveType || '4g',
      isSlowConnection: connection?.effectiveType === 'slow-2g' || 
                       connection?.effectiveType === '2g' ||
                       connection?.saveData === true ||
                       false,
      saveData: connection?.saveData || false
    };
  }

  /**
   * Generate poster image from video (client-side)
   */
  generatePosterFromVideo(videoSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Seek to 10% of video duration for a good poster frame
        video.currentTime = video.duration * 0.1;
      });
      
      video.addEventListener('seeked', () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const posterDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(posterDataUrl);
        } else {
          reject(new Error('Could not generate poster'));
        }
      });
      
      video.addEventListener('error', reject);
      video.src = videoSrc;
    });
  }
}