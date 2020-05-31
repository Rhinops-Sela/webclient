import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./shared/routing/app-routing.module";
import { AppComponent } from "./app.component";
import { CommonsModule } from "./commons/commons.module";
import { FeaturesModule } from "./features/features.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NavigateService } from "./shared/services/navigation.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonsModule,
    FeaturesModule,
    HttpClientModule,
  ],
  providers: [NavigateService],
  bootstrap: [AppComponent],
})
export class AppModule {}
