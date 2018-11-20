import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { ProgramDefinitions } from '../programs/program-definitions.var';


@Injectable()
export class ProgramListService { // this is in charge of creating programs and acting as an archive of program definitions. it does not keep track of program statuses/individual instances
  private _create = new BehaviorSubject<any>(null);  // any is program object

  public createStream: Observable<any> = this._create.asObservable(); // really just serves to notify because when first instantiated, the receivers haven't yet been instatiated and the open on start programs are ignored except for the last one
  public createStreamQueue: Array<any> = []; // the actual create queue

  public defaultProgramsMap: any = {}; // a map where the key is the file type and the value is a definition that can open it
  public desktopProgramsArray: Array<any> = []; // an array of program "shortcuts" that belong on the taskbar
  public programsArray: Array<any>;
  public programsMap: any = {}; // a map of all program definitions. a program definition should NOT exist for each instance of a program, only for the instances as a collection
  public taskbarProgramsArray: Array<any> = []; // an array of program "shortcuts" that belong on the taskbar

  constructor() {
  }

  public createInfoBox (message: String, level: String, eventHandler: Function) {
    /* Creates an info box based on the arguments */
    const args = {
      message: message,
      level: level,
      eventHandler: eventHandler
    };
    this.createProgramFromId('info-box', args);
  }

  public createProgram (program: any, args: any = null): void { // aka RUN program based on a program definition
    program.count++;
    this.createStreamQueue.push({program: program, args: args});
    this._create.next(program);
  }

  public createProgramFromId (programId: string, args: any = null): any { 
    // creates a program from the program definition. returns the program definition
    const programDefinition = this.programsMap[programId];
    this.createProgram(programDefinition, args);
    return programDefinition;
  }

  public openFile (file: any): void {
    /* tries to open a program to view the file */
    const defaultProgram = this.defaultProgramsMap[file.type];
    if (!!defaultProgram) {
      this.createProgram(defaultProgram, {file: file});
    } else {
      // if a default program does not exist
      this.createInfoBox('No program exists to open ' + file.name + ' of type '
      + file.type, 'info', null);
    }
  }

  public processProgramDefinitions (programs: Array<any>) {
    this.programsArray = programs;
    programs.forEach((program) => {
      program.count = 0;
      this.programsMap[program.id] = program;
      if (program.pin.desktop) {
        this.desktopProgramsArray.push(program);
      }
      if (program.pin.taskbar) {
        this.taskbarProgramsArray.push(program);
      }
      if (program.openOnStart) {
        this.createProgram(program);
      }
      if (!!program.openFiles) {
        /* the type of files the can program can open. will be be used to open files of this type

        TODO: Declare the specs for the arguments. 
        Currently overrides existing program if more than one program can 
        open a file type--make this behavior customizable 
        */
        program.openFiles.forEach((fileType) => {
          this.defaultProgramsMap[fileType] = program;
        });
      }
    });
  }
  // BEGIN Private Functions



  // END Private Functions

}
