import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './pages/play/play.component';
import { ManageComponent } from './pages/manage/manage.component';

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
