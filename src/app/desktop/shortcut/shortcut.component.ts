import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: "shortcut",
  templateUrl: "./shortcut.component.html",
  styleUrls: ["./shortcut.component.scss"]
})
export class ShortcutComponent implements OnInit {
  @Input() programDefinition: any;
  @Input() selected: boolean = false;

  @Output('event') event: EventEmitter<any> = new EventEmitter();

  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  ngOnInit () {
    this.addEventListeners();
  }

  // BEGIN Private Functions
  private addEventListeners () {
    /* Adds the event listeners */
    this.contentWrapper.nativeElement.addEventListener('dblclick', (event) => {
      this.event.emit({
        event: 'dblclick',
        program: this.programDefinition
      });
    });
  }
  // END Private Functions
}
