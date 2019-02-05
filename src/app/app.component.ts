import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
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

  constructor(private emoji: EmojiService) {}

  getCaretPos($event) {
    if ($event.selectionStart || $event.selectionStart == '0') {
       this.caretPos = $event.selectionStart;
    }
  }

  toggleEmojiMenu() {
    this.showEmojiMenu = !this.showEmojiMenu;
  }

  addEmoji($event) {
    const styles = this.emoji.emojiSpriteStyles($event.emoji.sheet, 'apple');
    const el = document.createElement('span');
    Object.assign(el.style, styles);
    // If using @ViewChild: and content editable.
    // this.chat.nativeElement.insertAdjacentHTML('beforeend', $event.emoji.native);
    this.message = [this.message.slice(0, this.caretPos), $event.emoji.native, this.message.slice(this.caretPos)].join('');
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
