import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatSelectionList, MatCheckboxChange, MatSelectionListChange} from '@angular/material';

export interface IMessage {
  message: string;
  recipients: string[];
}

export enum YourEnum {
  YourType = "Whatever"
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  message = '';
  sentMessage: IMessage;
  caretPos: number = 0;
  showEmojiMenu = false;

  contacts: string[] = ['Andi', 'Marco', 'Saja', 'Stephanie'];

  @ViewChild('contactList') contactList: MatSelectionList;

  YourEnum = YourEnum;
  nodeType = YourEnum.YourType;

  constructor() {}

  getCaretPos($event) {
    if ($event.selectionStart || $event.selectionStart == '0') {
       this.caretPos = $event.selectionStart;
    }
  }

  toggleEmojiMenu() {
    this.showEmojiMenu = !this.showEmojiMenu;
  }



  toggleContactSelection(all: MatCheckboxChange, list: MatSelectionList) {
    if (!all.checked && list.selectedOptions.selected.length === this.contacts.length) {
      list.deselectAll();
    } else {
      list.selectAll();
    }
  }

  isChecked(): boolean {
    return this.contactList.selectedOptions.selected && this.contactList.selectedOptions.selected.length
      && this.contactList.selectedOptions.selected.length === this.contacts.length;
  }

  isIndeterminate(): boolean {
    return this.contactList.selectedOptions.selected && this.contactList.selectedOptions.selected.length
      && this.contactList.selectedOptions.selected.length < this.contacts.length;
  }

  send() {
    const msg: IMessage = {
      message: this.message,
      recipients: this.contactList.selectedOptions.selected.map(c => c.value)
    }
    this.sentMessage = msg;
  }
}
