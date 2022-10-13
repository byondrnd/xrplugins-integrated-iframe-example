import {
  XREvent,
  XrTypes,
  CustomWindow,
  configurations,
  customEventType,
} from "./types";

// Gather plugin configuration
const jsonModule = await import("./config.json", {
  assert: { type: "json" },
});

// Get available event types
type XrEventType = keyof typeof XrTypes;

const data: configurations = jsonModule.default;

// Set Iframe and initial plugin.html source
const iframe =
  (document.querySelector(".inte-iframe") as HTMLIFrameElement) || null;
iframe.src = "../plugin/plugin.html";
const iframeInput = document.querySelector(
  "#inte-input-frame"
) as HTMLInputElement;
iframeInput.value = "../plugin/plugin.html";
iframeInput.innerText = "../plugin/plugin.html";
const initBtn = document.querySelector(".inte-init-btn") as HTMLButtonElement;

// Initialize iframe source and trigger init event inside it
const initCalled = () => {
  const iWindow = (iframe?.contentWindow as CustomWindow) || null;
  if (iWindow) {
    // Inject emit and listen functions
    iWindow.emitEvent = emitEvent;
    iWindow.listenToEvent = listenToEvent;

    // Trigger init event inside the iframe
    iWindow.postMessage(
      {
        data,
      },
      "*"
    );
  }

  // Log the successful event generation message
  eventLogger({
    event: "init",
    data: null,
    from: "playground",
  });

  iframe.removeEventListener("click", initCalled);
};

// Change the iframe source
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

// Log the messsages inside the playground
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
  p.innerText = "=>" + e.event;

  eventLoggerDiv.appendChild(p);
};

const generateBtn = document.querySelector(
  ".inte-generate-button"
) as HTMLButtonElement;

// Custom event generator function which emits event inside the iframe
const generateEvent = () => {
  const type = document.querySelector(".inte-input") as HTMLInputElement;
  const typeValue = type?.value;
  const eventData = document.querySelector(".inte-data") as HTMLTextAreaElement;
  const eventValue = eventData?.value as any;
  const parsedValue = JSON.parse(eventValue);

  const data: customEventType = {
    event: typeValue,
    data: parsedValue,
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
// Emits event from iframe to playground and pass the XREvent object
const emitEvent = (XREvent: XREvent) => {
  if (Object.keys(XrTypes).includes(XREvent.event)) {
    eventLogger(XREvent);
    iframe.contentWindow?.postMessage(XREvent);
  } else {
    console.error("wrong event passed on emit.");
  }
};

// Subscribe and listen to all the events coming up from the iframe

// Listen event callback handler
const listenToEvent = (
  XREvent: XrEventType,
  callback?: (XREvent: any) => void
) => {
  if (Object.keys(XrTypes).includes(XREvent)) {
    alert("Plugin will listen to " + XREvent + " from now on wards");

    iframe.contentWindow?.addEventListener("message", function (e) {
      if (e.data.data.event === XREvent || e.data.event === XREvent) {
        const XrEventData = e.data.data.event ? e.data.data : e.data;
        callbackHandler(XrEventData, callback);
      }
    });
  } else {
    console.error("unsupported event.");
  }
};

// Iframe callback handler
const callbackHandler = (XRevent: any, callback?: Function) => {
  const xrEvent = XRevent.event as XrEventType;
  if (Object.keys(XrTypes).includes(xrEvent)) {
    callback?.(XRevent.data);
  }
};
