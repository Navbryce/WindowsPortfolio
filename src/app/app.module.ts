import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// components
import { AppComponent } from './app.component';
import { DesktopComponent, ShortcutComponent } from './desktop';
import { BrowserComponent, ConsoleComponent, ProgramComponent, TestProgram } from './programs';
import { TaskbarComponent, ProgramIconComponent } from './taskbar'
import { WindowComponent } from './window/';
import { IconComponent } from './window/icons'


// services
import { TaskbarService } from './services';
import { ProgramListService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
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
  entryComponents: [BrowserComponent, ConsoleComponent, ShortcutComponent, TestProgram],
  providers: [ProgramListService, TaskbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
