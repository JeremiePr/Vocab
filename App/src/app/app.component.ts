import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { getWords } from 'src/app/store/app.actions';
import { AppState } from 'src/app/store/app.state';
import { UiService } from './services/ui.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent
{
    constructor(
        @Inject(DOCUMENT) document: Document,
        renderer: Renderer2,
        uiService: UiService)
    {
        uiService.initialize(document, renderer);
    }
}
