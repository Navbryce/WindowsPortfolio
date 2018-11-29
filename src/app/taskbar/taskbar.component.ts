import { Component, OnInit } from '@angular/core';
import { TaskbarService } from '../services';
@Component({
  selector: 'taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent implements OnInit {
  public currentDate: Date;
  public permanentMap: any = {}; // a map of the programs with permanent pins on the taskbar where the ID is the programId NOT the window ID
  public iconsArray: Array<any> = []; // an array of program statuses of all the icons on the taskbar.
  public iconsMap : any = {}; // a map that provides easy access to the the statuses stored in icons (allows for one way data binding with the icon with easy search). the key is the program definition id.


  constructor (private taskbarService: TaskbarService) {
  }

  ngOnInit() {
    this.createPermanentMap(this.taskbarService.pinProgramsTaskbar);
    this.renderIcons(this.taskbarService.pinProgramsTaskbar, true); // render the permanent programs

    this.taskbarListener = this.taskbarListener.bind(this); // set the context of the listener
    this.taskbarService.updateStream.subscribe(this.taskbarListener);

    this.updateLoop();
  }

  public renderIcons (programs: Array<any>, programDefinitions: boolean): void {
    /* renders icons with program statuses/program definitions. this method does not check to see if the icon actually belongs on the taskbar
    if programDefinitions is true, it assumes the programs parameter is program definitions*/
    programs.forEach((program) => {
      let programStatus = programDefinitions ? {id: null, status: -2, programDefinition: program} : program;
      this.renderIcon(programStatus);
    });
  }

  public updateCurrentDate (callback: Function): void {
    this.currentDate = new Date();
    callback();
  }

  public renderIcon (programStatus) { // adds or updates a program to the taskbar
    const programDefinition = programStatus.programDefinition;

    // the icon doesn't exist yet. store the new status in the map and add it to the icon arary
    if (this.iconsMap[programDefinition.id] == null) { 
      this.iconsMap[programDefinition.id] = programStatus;
      this.iconsArray.push(programStatus);
    } else { // update the existing status
      const existingStatus = this.iconsMap[programDefinition.id];
      existingStatus.status = programStatus.status; // it's possible the status changed
      existingStatus.id = programStatus.id; // it's possible the id changed


      if (existingStatus.status === -2 && !programDefinition.pin.taskbar) {
        // remove the program if it's closing and not supposed to be pinned to the taskbar
        delete this.iconsMap[programDefinition.id];
        this.iconsArray = this.iconsArray.filter((needle) => {
          return needle !== existingStatus; // remove the program from the icons array
        });
      }
    }
  }

  // BEGIN Private Functions
  private clickListener (programStatus: any, action: number) { // called when a program icon has been clicked; action - indicates what was clicked: main button - 0; little close button - ()-1)
    if (action === 0) {
      const status = programStatus.status; // represents the current program's status
      switch (status) {
        case -2:
          this.taskbarService.createProgramInstanceFromDef(programStatus.programDefinition);
          break;
        case -1:
          this.taskbarService.updateFocus(programStatus.id); // if minimized, open it and give it focus
          break;
        case 0:
          this.taskbarService.updateFocus(programStatus.id); // if it is unfocused, give it focus
          break;
        case 1:
          this.taskbarService.minimizeProgram(programStatus.id); // minimize it if it has focus
          break;
      }
    }
  }

  private createPermanentMap (permanentPrograms: Array<any>) {
    this.permanentMap = {};
    permanentPrograms.forEach((programDefinition) => {
      this.permanentMap[programDefinition.id] = programDefinition;
    });
  }

  private taskbarListener (statusId: string) { // listens to the taskbar update service
    if (statusId != null) {
      let updatedStatus = this.taskbarService.getProgramStatus(statusId);
      this.renderIcon(updatedStatus);
    }
  }

  private updateLoop (): void { // creates an update loop. updates the time every second and initially when the function is first called
    this.updateCurrentDate(() => {
      setTimeout(() => {
        this.updateLoop();
      }, 1000);
    });
  }

  // End Private Functions

}
