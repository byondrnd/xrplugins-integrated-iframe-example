export enum XrTypes {
  xr_added_to_cart,
  xr_remove_cart,
  xr_open,
  xr_callback,
}

export type values = {
  type: string;
  minLength?: number;
  description?: string;
  placeHolder?: string;
  text: string;
  format?: string;
  row?: string | number;
  col?: string | number;
  enum?: Array<string>;
  ["name"]: {
    text: any;
  };
  options?: Array<object>;
  title: string;
  properties: {
    [key: string]: values;
  };
};

export interface jsonSchema {
  properties: {
    ["name"]: {
      type: string;
      format: string;
      ["name"]: any;
    };
  };
}
export interface IThemeConfig {
  primaryColor: string;
}

export interface IConfig {
  configurations: Map<string, any>;
}

export interface configurations {
  type: string;
  config: any;
  theming: IThemeConfig;
}
export interface XREvent {
  event: string;
  customEventName?: string;
  data: object;
}

export type customEventType = {
  event: string;
  data: any;
  from: string;
};

export interface CustomWindow extends Window {
  emitEvent: Function;
  listenToEvent: Function;
  attachEvent: any;
}
