/**
 * picker.directive
 */

import {
    Directive, ElementRef, Input, Compiler, ViewContainerRef, ComponentFactory,
    ReflectiveInjector, Output, EventEmitter, OnInit
} from '@angular/core';
import { DynamicModule } from './dynamic.module';
import { DialogComponent } from './dialog.component';

@Directive({
    selector: '[dateTimePicker]',
    host: {
        '(click)': 'onClick()',
    }
})
export class DateTimePickerDirective implements OnInit {

    @Input('dateTimePicker') dateTimePicker: any;
    @Output('dateTimePickerChange') dateTimePickerChange = new EventEmitter<any>(true);
    @Input() locale: string = 'en';
    @Input() viewFormat: string = 'll';
    @Input() returnObject: string = 'js';
    @Input() mode: 'popup' | 'dropdown' | 'inline' = 'popup';
    @Input() hourTime: '12' | '24' = '24'; // determines the hour format (12 or 24)
    @Input() theme: 'default' | 'green' | 'teal' | 'cyan' | 'grape' | 'red' | 'gray' = 'default'; // theme color
    @Input() positionOffset: string = '0%';
    @Input() pickerType: 'both' | 'date' | 'time' = 'both';

    private created: boolean;
    private dialog: any;

    constructor( private compiler: Compiler,
                 private vcRef: ViewContainerRef,
                 private el: ElementRef ) {
    }

    public ngOnInit(): void {
        if (this.mode === 'inline') {
            this.openDialog();
        }
    }

    public onClick(): void {
        this.openDialog();
    }

    public momentChanged( value: any ) {
        this.dateTimePickerChange.emit(value);
    }

    private openDialog(): void {
        if (!this.created) {
            this.created = true;
            this.compiler.compileModuleAndAllComponentsAsync(DynamicModule)
                .then(( factory: any ) => {
                    const compFactory: ComponentFactory<DialogComponent> = factory.componentFactories.find(( x: any ) => x.componentType === DialogComponent);
                    const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
                    const cmpRef = this.vcRef.createComponent(compFactory, 0, injector, []);
                    cmpRef.instance.setDialog(this, this.el, this.dateTimePicker, this.locale, this.viewFormat, this.returnObject,
                        this.positionOffset, this.mode, this.hourTime, this.theme, this.pickerType);
                    this.dialog = cmpRef.instance;
                });
        } else if (this.dialog) {
            this.dialog.openDialog(this.dateTimePicker);
        }
    }
}
