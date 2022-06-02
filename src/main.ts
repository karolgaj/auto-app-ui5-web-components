import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import '@ui5/webcomponents/dist/Button';
import '@ui5/webcomponents/dist/Label';
import '@ui5/webcomponents/dist/Table';
import '@ui5/webcomponents/dist/TableColumn';
import '@ui5/webcomponents/dist/TableRow';
import '@ui5/webcomponents/dist/TableCell';
import '@ui5/webcomponents/dist/Avatar';
import '@ui5/webcomponents/dist/Panel';
import '@ui5/webcomponents/dist/Input';
import '@ui5/webcomponents/dist/features/InputSuggestions';
import '@ui5/webcomponents/dist/DatePicker';
import '@ui5/webcomponents/dist/TimePicker';
import '@ui5/webcomponents/dist/Switch';
import '@ui5/webcomponents/dist/Dialog';
import '@ui5/webcomponents/dist/Select';
import '@ui5/webcomponents/dist/Title';
import '@ui5/webcomponents/dist/Card';
import '@ui5/webcomponents/dist/CardHeader';
import '@ui5/webcomponents/dist/Slider';
import '@ui5/webcomponents/dist/TextArea';
import '@ui5/webcomponents/dist/TabContainer';
import '@ui5/webcomponents/dist/Tab';
import '@ui5/webcomponents/dist/StepInput';

import '@ui5/webcomponents-fiori/dist/Bar';
import '@ui5/webcomponents-fiori/dist/ShellBar';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData';
import '@ui5/webcomponents-fiori/dist/IllustratedMessage';
import '@ui5/webcomponents/dist/features/InputElementsFormSupport';
import '@ui5/webcomponents-fiori/dist/Wizard';
import '@ui5/webcomponents-icons/dist/AllIcons';

import '@ui5/webcomponents/dist/Assets';
import '@ui5/webcomponents-fiori/dist/Assets';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
