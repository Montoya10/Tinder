import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, redirectLoggedInTo ,redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const isloggedIn = () => redirectLoggedInTo(['/home']);
const isNotLoggedIn = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: isNotLoggedIn }
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/updateuser/updateuser.module').then( m => m.UpdateuserPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: isNotLoggedIn }
  },
  {
    path: 'matches',
    loadChildren: () => import('./pages/matches/matches.module').then( m => m.MatchesPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: isNotLoggedIn }
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: isNotLoggedIn }
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
