import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from 'src/app/pages/manage/manage.component';
import { PlayComponent } from 'src/app/pages/play/play.component';

const routes: Routes = [
    { path: 'play', component: PlayComponent },
    { path: 'manage', component: ManageComponent },
    { path: '**', redirectTo: '/play' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
