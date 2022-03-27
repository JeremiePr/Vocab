import { Component, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit
{
    public themeToggle = false;

    public constructor(private readonly _uiService: UiService) { }

    public ngOnInit(): void
    {
        this.themeToggle = this._uiService.isDarkTheme();
    }

    public onChangeThemeToggle(): void
    {
        if (this.themeToggle)
        {
            this._uiService.setDarkTheme();
        }
        else
        {
            this._uiService.setLightTheme();
        }
    }
}
