import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
};

// components
import { AppComponent } from './app.component';
import { MenuComponent, MenuBarComponent } from './basic';
import { DesktopComponent, ShortcutComponent } from './desktop';
import { BrowserComponent, ConsoleComponent, DirectoryButtonComponent, FileExplorerCore,
   FileSelectComponent, GameFlappyComponent, GameFlappyWindow, InfoBoxComponent,
  FileExplorerComponent, TestProgram } from './programs';
import { TaskbarComponent, ProgramIconComponent } from './taskbar';
import { WindowComponent } from './window/';
import { IconComponent } from './window/icons';


// services
import {ProgramListService, TaskbarService } from './services';
import { HttpClient } from '@angular/common/http';
import {MatIconModule, MatButtonModule} from '@angular/material';

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
        GameFlappyWindow,
        IconComponent,
        InfoBoxComponent,
        MenuComponent,
        MenuBarComponent,
        ProgramIconComponent,
        ShortcutComponent,
        TaskbarComponent,
        TestProgram,
        WindowComponent,
        GameFlappyComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        PdfViewerModule,
        MatButtonModule,
        MatIconModule,
        PerfectScrollbarModule
    ],
  entryComponents: [BrowserComponent, ConsoleComponent,
     FileExplorerComponent, FileSelectComponent, GameFlappyWindow, InfoBoxComponent, ShortcutComponent, TestProgram],
  providers: [
          HttpClient,
          ProgramListService,
          TaskbarService,
          {
              provide: PERFECT_SCROLLBAR_CONFIG,
              useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
          }
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
