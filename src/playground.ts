import {
  XREvent,
  XrTypes,
  CustomWindow,
  configurations,
  customEventType,
} from "./types";

const jsonModule = await import("./config.json", {
  assert: { type: "json" },
});

const data: configurations = jsonModule.default;

const emitEvent = (XREvent: XREvent) => {
  if (Object.keys(XrTypes).includes(XREvent.event)) {
    parent.postMessage({ XREvent }, "*");
    eventLogger(XREvent);
  } else {
    console.error("wrong event passed on emit.");
  }
};

const callbackHandler = (event: string, callback: Function) => {
  if (Object.keys(XrTypes).includes(event)) {
    callback(event);
  }
};

const listenToEvent = (XREvents: string, callback: (XREvent: any) => void) => {
  if (Object.keys(XrTypes).includes(XREvents)) {
    callbackHandler(XREvents, callback);
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
iframeInput.value = "plugin.html";
iframeInput.innerText = "plugin.html";

const initBtn = document.querySelector(".inte-init-btn") as HTMLButtonElement;

const initCalled = () => {
  const iWindow = (iframe?.contentWindow as CustomWindow) || null;
  if (iWindow) {
    iWindow.emitEvent = emitEvent;
    iWindow.listenToEvent = listenToEvent;
  }
  iWindow.postMessage(
    {
      data,
    },
    "*"
  );
  eventLogger({
    event: "init",
    from: "playground",
  });
  iframe.removeEventListener("click", initCalled);
};
const changeIframe = () => {
  const iframeValue = document.getElementById(
    "inte-input-frame"
  ) as HTMLInputElement;
  if (iframeValue) {
    iframe.src = iframeValue.value;
    iframe.addEventListener("load", initCalled);
  }
};

initBtn.addEventListener("click", changeIframe);

const eventLogger = (e: any) => {
  const eventLoggerDiv = document.querySelector(
    ".inte-event-logger-div"
  ) as HTMLDivElement;
  const p = document.createElement("p");
  if (e.from === "playground") {
    p.style.color = "blue";
  } else {
    p.style.color = "orange";
  }
  p.innerText = "=>" + JSON.stringify(e.event);
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
    from: "playground",
  };
  iframe.contentWindow?.postMessage(
    {
      data,
    },
    "*"
  );
};

generateBtn.onclick = generateEvent;
