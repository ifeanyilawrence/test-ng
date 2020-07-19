import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EditorComponent } from './components/editor/editor.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
      path: 'editor',
      component: EditorComponent,
      pathMatch: 'full',
      canActivate: [AuthGuard]
  },
  {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
  },
  { 
      path: '404', 
      component: NotfoundComponent
  },
  { 
      path: '**', 
      pathMatch   : 'full', 
      component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
