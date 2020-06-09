import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DemoMaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InputComponentComponent } from './components/input/input-component.component';
import { DomainsLayoutComponent } from './components/domains-layout/domains-layout.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { ToolbarComponent } from './components/toolbar/toolbar-layout.component';
import { PagesLayoutComponent } from './components/pages-layout/pages-layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CommandButtonsComponent } from './components/command-buttons/command-buttons.component';
import { DeploymentProgressModalComponent } from './components/deplopyment-progress-modal/deployment-progress-modal.component';
// import { FileSelectDirective } from 'ng2-file-upload';
@NgModule({
  declarations: [AppComponent, DomainsLayoutComponent, SideNavComponent, InputComponentComponent, PageLayoutComponent, ToolbarComponent, PagesLayoutComponent, ConfirmationModalComponent, CommandButtonsComponent, DeploymentProgressModalComponent],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    DemoMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
