import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  activePage = 'home';
  currentLanguage = 'en';
  isLanguageDropdownOpen = false;
  isScrolled = false;
  isHomePage = true;

  private routerSubscription?: Subscription;

  constructor(
    private translateService: TranslateService, 
    private router: Router,
    private elementRef: ElementRef
  ) {
    // Set default language
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    
    // Listen to route changes to update active page
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActivePage(event.urlAfterRedirects);
      this.isHomePage = event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/' || event.urlAfterRedirects === '';
      this.closeMenu(); // Close mobile menu on route change
    });
    
    // Set initial state
    const currentUrl = this.router.url;
    this.isHomePage = currentUrl === '/home' || currentUrl === '/' || currentUrl === '';
  }

  ngOnInit() {
    // Add scroll listener
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy() {
    // Remove scroll listener
    window.removeEventListener('scroll', this.onScroll.bind(this));
    
    // Unsubscribe from router events
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  private onScroll() {
    const scrollPosition = window.scrollY;
    this.isScrolled = scrollPosition > 50;
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const navbar = this.elementRef.nativeElement;
    
    // Close language dropdown if clicking outside
    if (this.isLanguageDropdownOpen && !navbar.contains(target)) {
      this.isLanguageDropdownOpen = false;
    }
  }

  @HostListener('window:keydown.escape')
  private onEscapeKey() {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
    if (this.isLanguageDropdownOpen) {
      this.isLanguageDropdownOpen = false;
    }
  }

  get shouldShowWhiteNavbar(): boolean {
    // Always show white navbar on About page or when scrolled or not on home page
    return this.activePage === 'about' || !this.isHomePage || this.isScrolled;
  }

  updateActivePage(url: string): void {
    if (url.includes('/home') || url === '/' || url === '') {
      this.activePage = 'home';
    } else if (url.includes('/products')) {
      this.activePage = 'products';
    } else if (url.includes('/services')) {
      this.activePage = 'services';
    } else if (url.includes('/about')) {
      this.activePage = 'about';
    } else if (url.includes('/contact')) {
      this.activePage = 'contact';
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Close language dropdown when menu is toggled
    if (this.isLanguageDropdownOpen) {
      this.isLanguageDropdownOpen = false;
    }
    
    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = ''; // Restore body scroll
  }

  toggleLanguageDropdown(): void {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  switchLanguage(language: string): void {
    this.currentLanguage = language;
    this.translateService.use(language);
    this.isLanguageDropdownOpen = false;
  }

  getCurrentLanguageLabel(): string {
    return this.currentLanguage === 'en' ? 'EN' : 'PL';
  }
}
