import { ElementRef, Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProgramComponent } from './programs';
import { ProgramListService, TaskbarService } from './services';
import { ProgramDefinitions } from './programs';
import { CustomComponent } from './basic';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends CustomComponent implements OnInit {
  public environment: any = environment;
  public disclaimer: Boolean = true;
  public mobilePrompt: Boolean = true;
  // if the mobile prompt has already been answered
  public mobilePromptAnswered: Boolean = false;

  @ViewChild('desktop', {read: ViewContainerRef}) desktop: ViewContainerRef;

  constructor (private componentFactoryResolver: ComponentFactoryResolver, private programListService: ProgramListService, private taskbarService: TaskbarService) {
    super();
    this.programListService.processProgramDefinitions(ProgramDefinitions); // entry point. tells everything to load in
  }

  ngOnInit() {
      // make sure the mobile version is not needed at start
      this.windowResize({width: window.innerWidth});

      /* set up the listeners for creating programs. NOTE:
      This is done in NgOnInit because @ViewChild needs to be
       initialized before createProgram can be called */
      this.createStreamLoop = this.createStreamLoop.bind(this);
      this.programListService.createStream.subscribe(this.createStreamLoop);
  }

  public createProgram (programDefinition: any, args: any = null): void {
    var programComponentFactory = this.componentFactoryResolver.resolveComponentFactory(programDefinition.component);
    var programReference = this.desktop.createComponent(programComponentFactory);
    var componentInstance: ProgramComponent = <ProgramComponent>(programReference.instance)
    componentInstance.programDefinition = programDefinition;
    componentInstance.programArgs = args;
    componentInstance.closeWindow.subscribe((signal) => { // the listener for the closeWindow output (the output is signaled when the window is ready to close. delete this isntance)
      programReference.destroy(); // destroy the component
      programDefinition.count--; // there is one less instance of the program
    });
  }

  public createStreamLoop (): void {
    let queue = this.programListService.createStreamQueue;
    if (queue.length > 0) {
      let queue = this.programListService.createStreamQueue;
      let program = queue.shift();
      this.createProgram(program.program, program.args);
      this.createStreamLoop();
    }
  }
  public windowResize (event: any) {
    const triggerWidth = 570;
    this.mobilePrompt = event.width <= triggerWidth && !this.mobilePromptAnswered;
  }

  @HostListener('window:resize', ['$event'])
  public resize(event): void {
    /* Trigger the resize events */
    event.width = window.innerWidth;
    event.height = window.innerHeight;
    this.windowResize(event);
  }
}
