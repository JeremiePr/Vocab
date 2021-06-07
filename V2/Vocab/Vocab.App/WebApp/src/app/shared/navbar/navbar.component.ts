import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {

    themeToggle = false;

    constructor(private eventService: EventService) { }

    onChangeThemeToggle(): void {
        if (this.themeToggle) {
            this.eventService.toggleDarkTheme.emit();
        }
        else {
            this.eventService.toggleLightTheme.emit();
        }
    }

}
