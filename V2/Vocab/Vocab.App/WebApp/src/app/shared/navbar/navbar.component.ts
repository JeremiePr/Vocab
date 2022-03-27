import { Component, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit
{
    themeToggle = false;

    constructor(private uiService: UiService) { }

    ngOnInit(): void
    {
        this.themeToggle = this.uiService.isDarkTheme();
    }

    onChangeThemeToggle(): void
    {
        if (this.themeToggle)
        {
            this.uiService.setDarkTheme();
        }
        else
        {
            this.uiService.setLightTheme();
        }
    }
}
