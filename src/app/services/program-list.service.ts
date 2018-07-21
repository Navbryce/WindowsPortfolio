import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable()
export class ProgramListService { // this is in charge of creating programs and acting as an archive of program definitions. it does not keep track of program statuses/individual instances
  private _create = new BehaviorSubject<any>(null);  // any is program object

  public createStream: Observable<any> = this._create.asObservable(); // really just serves to notify because when first instantiated, the receivers haven't yet been instatiated and the open on start programs are ignored except for the last one
  public createStreamQueue: Array<any> = []; // the actual create queue


  public desktopProgramsArray: Array<any> = []; // an array of program "shortcuts" that belong on the taskbar
  public programsArray: Array<any>;
  public programsMap: any = {}; // a map of all program definitions. a program definition should NOT exist for each instance of a program, only for the instances as a collection
  public taskbarProgramsArray: Array<any> = []; // an array of program "shortcuts" that belong on the taskbar
  constructor() {
  }

  public createProgram (program: any): void { // aka RUN program based on a program definition
    this.createStreamQueue.push(program);
    this._create.next(program);
  }

  public createProgramFromId (programId: string): any { // creates a program from the program definition. returns the program definition
    var programDefinition = this.programsMap[programId];
    this.createProgram(programDefinition);
    return programDefinition;
  }

  public processProgramDefinitions (programs: Array<any>) {
    this.programsArray = programs;
    programs.forEach((program) => {
      this.programsMap[program.id] = programs;
      if (program.pin.desktop) {
        this.desktopProgramsArray.push(program);
      }
      if (program.pin.taskbar) {
        this.taskbarProgramsArray.push(program);
      }
      if (program.openOnStart) {
        this.createProgram(program);
      }
    });
  }
  // BEGIN Private Functions



  // END Private Functions

}
