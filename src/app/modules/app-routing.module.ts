import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesLayoutComponent } from '../components/pages-layout/pages-layout.component';
import { DomainsLayoutComponent } from '../components/domains-layout/domains-layout.component';
import { PageLayoutComponent } from '../components/page-layout/page-layout.component';


const routes: Routes = [
  { path: '', component: DomainsLayoutComponent },
  { path: 'pages', component: PagesLayoutComponent },
  { path: 'page', component: PageLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
