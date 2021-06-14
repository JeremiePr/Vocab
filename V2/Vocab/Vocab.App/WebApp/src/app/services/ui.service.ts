import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    private document: Document | null = null;
    private renderer: Renderer2 | null = null;

    initialize(document: Document, renderer: Renderer2) {
        this.document = document;
        this.renderer = renderer;
        if (this.isDarkTheme()) {
            this.renderer.setAttribute(this.document.body, 'class', 'theme-dark');
        }
        else {
            this.renderer.setAttribute(this.document.body, 'class', 'theme-light');
        }
    }

    isDarkTheme(): boolean {
        return localStorage.getItem('vocab-app-theme') === 'dark';
    }

    setDarkTheme(): void {
        localStorage.setItem('vocab-app-theme', 'dark');
        this.renderer?.setAttribute(this.document?.body, 'class', 'theme-dark');
    }

    setLightTheme(): void {
        localStorage.setItem('vocab-app-theme', 'light');
        this.renderer?.setAttribute(this.document?.body, 'class', 'theme-light');
    }
}
