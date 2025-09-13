import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  activePage = 'home'; // Set home as active by default
  currentLanguage = 'en'; // Default language
  isLanguageDropdownOpen = false;
  isScrolled = false;
  isHomePage = true;

  constructor(private translateService: TranslateService, private router: Router) {
    // Set default language
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    
    // Listen to route changes to update active page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActivePage(event.urlAfterRedirects);
      this.isHomePage = event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/' || event.urlAfterRedirects === '';
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
  }

  private onScroll() {
    const scrollPosition = window.scrollY;
    this.isScrolled = scrollPosition > 50; // Change navbar after 50px scroll
  }

  get shouldShowWhiteNavbar(): boolean {
    return !this.isHomePage || this.isScrolled;
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
  }

  closeMenu(): void {
    this.isMenuOpen = false;
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
