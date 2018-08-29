import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// components
import { AppComponent } from './app.component';
import { IconComponent } from './window/icons'
import { ConsoleComponent, ProgramComponent, TestProgram } from './programs';
import { DesktopComponent, ShortcutComponent } from './desktop';
import { TaskbarComponent, ProgramIconComponent } from './taskbar'
import { WindowComponent } from './window/';

// services
import { TaskbarService } from './services';
import { ProgramListService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    DesktopComponent,
    IconComponent,
    ProgramIconComponent,
    ShortcutComponent,
    TaskbarComponent,
    TestProgram,
    WindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  entryComponents: [ConsoleComponent, ShortcutComponent, TestProgram],
  providers: [ProgramListService, TaskbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
