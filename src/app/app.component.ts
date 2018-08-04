import { ElementRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProgramComponent } from './programs';
import { ProgramListService, TaskbarService } from './services';
import { ProgramDefinitions } from './programs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('desktop', {read: ViewContainerRef}) desktop: ViewContainerRef;

  constructor (private componentFactoryResolver: ComponentFactoryResolver, private programListService: ProgramListService, private taskbarService: TaskbarService) {
    this.programListService.processProgramDefinitions(ProgramDefinitions); // entry point. tells everything to load in
  }

  ngOnInit() {
      // set up the listeners for creating programs. NOTE: This is done in NgOnInit because @ViewChild needs to be initialized before createProgram can be called
      this.createStreamLoop = this.createStreamLoop.bind(this);
      this.programListService.createStream.subscribe(this.createStreamLoop);
  }

  public createProgram (programDefinition: any): void {
    var programComponentFactory = this.componentFactoryResolver.resolveComponentFactory(programDefinition.component);
    var programReference = this.desktop.createComponent(programComponentFactory);
    var componentInstance: ProgramComponent = <ProgramComponent>(programReference.instance)
    componentInstance.programDefinition = programDefinition;
    componentInstance.closeWindow.subscribe((signal) => { // the listener for the closeWindow output (the output is signaled when the window is ready to close. delete this isntance)
      programReference.destroy(); // destroy the component
    });
  }

  public createStreamLoop (): void {
    let queue = this.programListService.createStreamQueue;
    if (queue.length > 0) {
      let queue = this.programListService.createStreamQueue;
      let program = queue.shift();
      this.createProgram(program);
      this.createStreamLoop();
    }
  }
}
