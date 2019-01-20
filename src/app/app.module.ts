import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// components
import { AppComponent } from './app.component';
import { MenuComponent, MenuBarComponent } from './basic';
import { DesktopComponent, ShortcutComponent } from './desktop';
import { BrowserComponent, ConsoleComponent, DirectoryButtonComponent, FileExplorerCore,
   FileSelectComponent, InfoBoxComponent,
  FileExplorerComponent, TestProgram } from './programs';
import { TaskbarComponent, ProgramIconComponent } from './taskbar';
import { WindowComponent } from './window/';
import { IconComponent } from './window/icons';


// services
import {ProgramListService, TaskbarService } from './services';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    ConsoleComponent,
    DesktopComponent,
    DirectoryButtonComponent,
    FileExplorerComponent,
    FileExplorerCore,
    FileSelectComponent,
    IconComponent,
    InfoBoxComponent,
    MenuComponent,
    MenuBarComponent,
    ProgramIconComponent,
    ShortcutComponent,
    TaskbarComponent,
    TestProgram,
    WindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    PdfViewerModule
  ],
  entryComponents: [BrowserComponent, ConsoleComponent,
     FileExplorerComponent, FileSelectComponent, InfoBoxComponent, ShortcutComponent, TestProgram],
  providers: [HttpClient, ProgramListService, TaskbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
