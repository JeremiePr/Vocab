import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { UiService } from './services/ui.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent
{
    constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private uiService: UiService)
    {
        this.uiService.initialize(this.document, this.renderer);
    }
}
