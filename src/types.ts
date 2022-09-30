export type XREvents = 'xr_add_to_cart';

export interface IThemeConfig {
    primaryColor : string,
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
  event: XREvents;
  customEventName: string;
  data: object;
};

export type customEventType = {
  type: string;
  data: any;
}

export interface CustomWindow extends Window {
  emitEvent: Function;
  listenToEvent: Function;
}
