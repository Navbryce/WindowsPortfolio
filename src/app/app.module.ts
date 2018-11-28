import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// components
import { AppComponent } from './app.component';
import { DesktopComponent, ShortcutComponent } from './desktop';
import { BrowserComponent, ConsoleComponent, DirectoryButtonComponent, InfoBoxComponent,
  FileExplorerComponent, TestProgram } from './programs';
import { TaskbarComponent, ProgramIconComponent } from './taskbar';
import { WindowComponent } from './window/';
import { IconComponent } from './window/icons';


// services
import {ProgramListService, TaskbarService } from './services';
import { HttpClient } from '@angular/common/http';
import { Direct } from 'protractor/built/driverProviders';

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    ConsoleComponent,
    DesktopComponent,
    DirectoryButtonComponent,
    FileExplorerComponent,
    IconComponent,
    InfoBoxComponent,
    ProgramIconComponent,
    ShortcutComponent,
    TaskbarComponent,
    TestProgram,
    WindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PdfViewerModule
  ],
  entryComponents: [BrowserComponent, ConsoleComponent,
     FileExplorerComponent, InfoBoxComponent, ShortcutComponent, TestProgram],
  providers: [HttpClient, ProgramListService, TaskbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
