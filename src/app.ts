import {
  XREvent,
  XREvents,
  CustomWindow,
  configurations,
  customEventType,
} from "./types";

const jsonModule = await import("./config.json", {
  assert: { type: "json" },
});

const data: configurations = jsonModule.default;
const allowedEvents: Array<XREvents> = [
  "xr_add_to_cart",
  "xr_remove_cart",
  "xr_open",
];

const emitEvent = (XREvent: XREvent) => {
  if (allowedEvents.includes(XREvent.event)) {
    parent.postMessage({ XREvent }, "*");
  } else {
    console.error("wrong event passed on emit.");
  }
};

const messages = (message: MessageEvent) => {
  logEvents(message.data.XREvent.event);
  parent.removeEventListener("message", messages);
};

const listenToEvent = (
  XREvents: XREvents,
  callback: (XREvent: any) => void
) => {
  if (allowedEvents.includes(XREvents)) {
    parent.addEventListener("message", messages);
    const result = {
      event: "xr_get_product",
      product: "proudct_2",
    };
    callback(result);
  } else {
    console.error("unsupported event.");
  }
};

const iframe =
  (document.querySelector(".inte-iframe") as HTMLIFrameElement) || null;

iframe.src = "./plugin.html";
const iframeInput = document.querySelector(
  "#inte-input-frame"
) as HTMLInputElement;
console.log(iframeInput, "iframe");
iframeInput.value = "plugin.html";
iframeInput.innerText = "plugin.html";

const initBtn = document.querySelector(".inte-init-btn") as HTMLButtonElement;

const changeIframe = () => {
  const iframeValue = document.getElementById(
    "inte-input-frame"
  ) as HTMLInputElement;
  if (iframeValue) {
    iframe.src = iframeValue.value;
    iframe.onload = init;
    const iWindow = (iframe?.contentWindow as CustomWindow) || null;
    iframe.addEventListener("load", function () {
      iWindow.postMessage(
        {
          data,
        },
        "*"
      );
    });
    logEvents("init");
  }
};

initBtn.addEventListener("click", changeIframe);

const logEvents = (e: any) => {
  const eventLoggerDiv = document.querySelector(
    ".inte-event-logger-div"
  ) as HTMLDivElement;
  const p = document.createElement("p");
  p.innerText = "=>" + JSON.stringify(e);
  eventLoggerDiv.appendChild(p);
};

const generateBtn = document.querySelector(
  ".inte-generate-button"
) as HTMLButtonElement;

const generateEvent = () => {
  const type = document.querySelector(".inte-input") as HTMLInputElement;
  const typeValue = type?.value;
  const eventData = document.querySelector(".inte-data") as HTMLTextAreaElement;
  const eventValue = eventData?.value;
  const data: customEventType = {
    event: typeValue,
    data: eventValue,
  };
  iframe.contentWindow?.postMessage(
    {
      data,
    },
    "*"
  );
};

generateBtn.onclick = generateEvent;

const init = () => {
  const iWindow = (iframe?.contentWindow as CustomWindow) || null;
  if (iWindow) {
    iWindow.emitEvent = emitEvent;
    iWindow.listenToEvent = listenToEvent;
  }
};

iframe.onload = init;
