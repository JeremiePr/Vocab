import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    private document!: Document;
    private renderer!: Renderer2;

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
        this.renderer.setAttribute(this.document.body, 'class', 'theme-dark');
    }

    setLightTheme(): void {
        localStorage.setItem('vocab-app-theme', 'light');
        this.renderer.setAttribute(this.document.body, 'class', 'theme-light');
    }
}
