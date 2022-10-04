export enum XrTypes {
  xr_add_to_cart,
  xr_remove_cart,
  xr_open,
  xr_callback,
};

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
  customEventName: string;
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
}
