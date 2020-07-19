import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import MediumEditor from 'medium-editor';
import { TextEdit } from "../../model/textEdit";
import { User } from "../../model/user";
import { AuthService } from 'src/app/service/auth.service';
import { AngularFirestore , AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  subscription: Subscription;
  source = interval(2000);
  
  editor: any;
  textContent: string;
  user: User;

  textsCollectionRef: AngularFirestoreCollection<TextEdit>;
  hasText: boolean;
  loaded: boolean;

  @ViewChild('editable', { static: true }) editable: ElementRef;

  constructor(private authService: AuthService, private afs: AngularFirestore) {
    this.textsCollectionRef = this.afs.collection('texts');
    this.getUserText();
  }

  ngOnInit() {
    this.subscription = this.source.subscribe(val => this.saveText());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getUserText(){

    this.user = this.authService.getUser();

    this.afs.collection<TextEdit>('texts', ref => ref.where('id', '==', this.user.uid).limit(1)).valueChanges().subscribe((res: TextEdit[]) => {
      if(res && res[0] && !this.loaded) {
        console.log(res ,'res');
        this.textContent = res[0].text;
        this.editor.elements[0].innerHTML = res[0].text;
        this.hasText = !!res[0].text;
        this.loaded = true;

        if(!!res[0].text) {
          this.editor.elements[0].focus();
        }
      }
    });
  }

  private saveText(): void {

    let newText = this.editor.elements[0].innerHTML;

    if((!this.textContent && newText) || this.textContent != newText)
    {
      this.textContent = this.editor.elements[0].innerHTML;
      
      this.user = this.authService.getUser();
      
      if(this.hasText && this.textContent != "") {

        this.afs.collection<TextEdit>('texts', ref => ref.where('id', '==', this.user.uid).limit(1)).valueChanges().subscribe((res: TextEdit[]) => {
          
          if(res && res[0] && res[0]) {
            this.textsCollectionRef.doc(this.user.uid).update({ text: this.textContent });
          }
        });
      }

      if(!this.hasText && this.textContent != "") {
        const textItem: TextEdit = { id: this.user.uid, text: this.textContent };
        this.textsCollectionRef.doc(this.user.uid).set(textItem);
      }
    }
  }

  ngAfterViewInit() {

    let placeHoldr: any = {
        text: 'Type your text',
        hideOnClick: true
    };

    if(this.hasText)
      placeHoldr = false;

    this.editor = new MediumEditor(this.editable.nativeElement, {
      toolbar: {
        allowMultiParagraphSelection: true,
        buttons: [
          'bold',
          'italic',
          {
              name: 'h1',
              action: 'append-h2',
              aria: 'header type 1',
              tagNames: ['h2'],
              contentDefault: '<b>H1</b>',
              classList: ['custom-class-h1'],
              attrs: {
                  'data-custom-attr': 'attr-value-h1'
              }
          },
          {
              name: 'h2',
              action: 'append-h3',
              aria: 'header type 2',
              tagNames: ['h3'],
              contentDefault: '<b>H2</b>',
              classList: ['custom-class-h2'],
              attrs: {
                  'data-custom-attr': 'attr-value-h2'
              }
          },
          'justifyCenter',
          'quote',
          'anchor',
          'underline', 'h2', 'h3'
      ],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        relativeContainer: null,
        standardizeSelectionStart: false,
        static: false,
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
      anchorPreview: {
        hideDelay: 500,
        previewValueSelector: 'a'
    },
    placeholder: placeHoldr
    });
  }
}