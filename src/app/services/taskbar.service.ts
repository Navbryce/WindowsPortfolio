import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { ProgramListService } from './program-list.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

// TODO THIS NEEDS TO BE RENAMED TO PROGRAM CONTROLLER
// IN CHARGE OF UPDATING AND MAINTAINING PROGRAM STATUSES.

@Injectable()
export class TaskbarService {
  private _taskbarMap: any;  // map where the key is the id of the window and the value is the object that describes the status as well as other information (such as the image )
  /*
  Status Info
  -2: Closed
  -1: Minimized
  0: Not focused but open
  1: Focused
  */
  private _update = new BehaviorSubject<string>(null);  // string represents the id of what is being updated
  public activeProgramsCount: any = {}; // key is the program definition id. value is the count
  public currentFocusId = null;
  public get pinProgramsDesktop () { // returns the programs that are permanently pinned to the desktop
    return this.programListService.desktopProgramsArray;
  }
  public get pinProgramsTaskbar () { // returns the programs that are permanently pinned to the taskbar
    return this.programListService.taskbarProgramsArray;
  }
  public taskbarArray = [];  // essentially the _taskbarMap but in array form. can be used by other components to easily render what is necessary by iterating through this object
  public updateStream = this._update.asObservable();

  constructor(private programListService: ProgramListService) {
    this._taskbarMap = {};
  }

  public closeProgram (id: string) {
   this.findNewFocusWithAction(id, -2);
   this.activeProgramsCount[this._taskbarMap[id].programDefinition.id] -= 1;
  }

  public createInfoBox (message: String = null, level: String = null, eventHandler: Function = null) {
    this.programListService.createInfoBox(message, level, eventHandler);
  }

  public createProgramInstanceFromDef (programDefinition: any, args: any = null): any {  // send the program definition of the program you're trying to instantiate. will make the program
    if (!programDefinition.unique || (this.activeProgramsCount[programDefinition.id] == null || this.activeProgramsCount[programDefinition.id] == 0)) {
      this.programListService.createProgram(programDefinition, args);
    }
  }

  public createProgramInstanceFromId (programId: string, args: any = null): any {
    /*
    programId - THE programID NOT the instance id.
    returns the programDefinition
    */
    var programDefinition = this.programListService.programsMap[programId];

    return this.createProgramInstanceFromDef(programDefinition, args);
  }

  public createProgramStatus (id: string, image_source: string, programDefinition: any, status: number): any {
    /* returns the status object. throws Exception if status already in array
      only called when a program reopens or is being opened
    */
    var returnObject;
    if (this._taskbarMap[id] != null) {
      if (this._taskbarMap[id] == -2 && status != -2) { // the program used to have a status of -2, meaning the program is being reopened
         this.updateProgramStatus(id, status);
      } else {
        returnObject = new Error(`The program with ${id} already had a status object created for it and the program was not previously closed.`);
        return returnObject;
      }
    } else {
      returnObject = {
        id: id,
        lastUpdated: new Date().getTime(),
        programDefinition: programDefinition,
        src: image_source,
        status: status
      };
      this._taskbarMap[id] = returnObject;
      this._update.next(id);
      this.taskbarArray.unshift(returnObject); // add to front
    }
    this.activeProgramsCount[programDefinition.id] = this.activeProgramsCount[programDefinition.id] == null ? 1 : this.activeProgramsCount[programDefinition.id] + 1;
    return returnObject;
  }

  public getDefaultProgramsMap (): any {
    /* returns the default programs map */
    return this.programListService.defaultProgramsMap;
  }

  public getProgramStatus (id: string): any {  // returns the status object
    return this._taskbarMap[id];
  }

  public garbageCollection (): any { // removes programs from the array/map that have no active instances

  }

  public hasStatus (id: string): boolean {
    return this._taskbarMap[id] != null;
  }

  public minimizeProgram (id: string): void {
    this.findNewFocusWithAction(id, -1);
  }

  public openFile (file: any): void {
    /* Tries to open the file based on the file object */
    this.programListService.openFile(file);
  }


  public removeStatus (id: string): any {  // returns removed object. null if object was never in map
    var object = this._taskbarMap[id];
    delete this._taskbarMap[id]
    this.taskbarArray = Object.values(this._taskbarMap);  //  not the most efficient, but because we're not dealing with thousands of properties, it doesn't matter
    return object;
  }

  public updateFocus (newFocusId: string) { //  a null focusId stands for the desktop AKA no program is focused. will unfocus the old focus
    this.updateFocusAdvanced(newFocusId, 0);
  }

  public updateProgramStatus (id: string, newStatus: number) {  // returns the new status object. returns exception if object never had a status in the first place TODO: MAKE THIS PRIVATE
    // console.log(`update ${id} with the status of ${newStatus}`);
    var statusObject = this._taskbarMap[id];
    var returnValue = null;
    if (statusObject != null) {
      returnValue = statusObject;
      if (statusObject.status !== newStatus) {  // only send the update event if the program icon actually has a new status
        statusObject.lastUpdated = new Date().getTime();
        statusObject.status = newStatus;
        this._update.next(id);
      }
       //  not the most efficient, but because we're not dealing with thousands of properties, it doesn't matter
      // sort so most recently updated is at the top
      this.taskbarArray = Object.values(this._taskbarMap).sort((a: any, b: any) => {
        return b.lastUpdated - a.lastUpdated;
      });
    } else {
      returnValue = new Error(`The program with id ${id} never had a program status created for it.`);
    }
    return returnValue;
  }

  // BEGIN Private Functions

  private findNewFocusWithAction (id: string, newState: number): void {
     /* special actions need to be taken if the program being minimized/closed holds focus
     (need to find a new window to focus). newState represents the new state 
     of what current has focus (the id) */
    if (id === this.currentFocusId) {
      const programStatus = this.taskbarArray.find((status) => { // find a new program to receive focus
        return status.status === 0;
      });
      // -1 tells the taskbar service to minimize the old program with focus (AKA the program with the id that matches the parameter id)
      this.updateFocusAdvanced(programStatus == null ? null : programStatus.id, newState); 
    } else {
      /* since the current program doesn't have focus, just minimize it. 
      you don't need to bother giving another program focus because the focus isn't changing */
      this.updateProgramStatus(id, newState);
    }
    // console.log(JSON.stringify(this._taskbarMap));

  }

  private updateFocusAdvanced (newFocusId: string, newStatusForPreviousFocus: number) {
    // lets you specify the new state of the old window to have focus
    if (this.currentFocusId != newFocusId) { //  don't bother updating anything if there is no actual change
      if (this.currentFocusId != null) {
        this.updateProgramStatus(this.currentFocusId, newStatusForPreviousFocus); // it's no longer focused
      }
      if (newFocusId != null) {
        this.updateProgramStatus(newFocusId, 1);
      }
      this.currentFocusId = newFocusId;
    }
  }
  // END Private Functions
}
