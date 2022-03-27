import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ManageComponent } from 'src/app/pages/manage/manage.component';
import { PlayComponent } from 'src/app/pages/play/play.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { ProgressComponent } from 'src/app/shared/progress/progress.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { FlexModule, GridModule, FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import { appReducers } from 'src/app/app-store-index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { ManageEffects } from 'src/app/pages/manage/store/manage.effects';
import { PlayEffects } from 'src/app/pages/play/store/play.effects';
import { SharedEffects } from 'src/app/shared/store/shared.effects';

@NgModule({
    declarations: [
        AppComponent,
        ManageComponent,
        PlayComponent,
        NavbarComponent,
        ProgressComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        FlexModule,
        GridModule,
        FlexLayoutModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDividerModule,
        MatCardModule,
        MatSortModule,
        MatProgressBarModule,
        MatCheckboxModule,
        MatIconModule,
        MatSlideToggleModule,
        StoreModule.forRoot(appReducers),
        StoreDevtoolsModule.instrument(),
        EffectsModule.forRoot([ManageEffects, PlayEffects, SharedEffects])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
