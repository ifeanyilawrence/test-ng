import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import MediumEditor from 'medium-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  subscription: Subscription;
  source = interval(2000);
  
  editor: any;
  textContent: any;

  @ViewChild('editable', { static: true }) editable: ElementRef;

  constructor() { }

  ngOnInit() {
    this.subscription = this.source.subscribe(val => this.saveText());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private saveText(): void {
    let newText = this.editor.elements[0].innerHTML;
    if((!this.textContent && newText) || this.textContent != newText)
    {
      this.textContent = this.editor.elements[0].innerHTML;
      console.log(this.textContent);
    }
  }

  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.editable.nativeElement, {
      toolbar: {
        /* These are the default options for the toolbar,
           if nothing is passed this is what is used */
        allowMultiParagraphSelection: true,
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
        /* options which only apply when static is true */
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false
      },
      paste: {
        forcePlaneText:false,
        cleanPastedHTML: true,
        cleanReplacements: [],
        cleanAttrs: ['class', 'style', 'dir', 'name'],
        cleanTags: ['label', 'meta'],
        unwrapTags: []
      },
    });
  }

  log() {
    console.log(this.editor.elements[0].innerHTML);
  }
}
