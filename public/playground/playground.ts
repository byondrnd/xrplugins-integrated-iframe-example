const { Subject } = rxjs;

import {
  XREvent,
  XrTypes,
  CustomWindow,
  configurations,
  customEventType,
} from "./types";

const subject = new Subject();

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
  const eventValue = eventData?.value;

  const data: customEventType = {
    event: typeValue,
    data: eventValue,
    from: "playground",
  };

  if (data.event) {
    subject.next(data);
  }

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
    subject.next(XREvent);
  } else {
    console.error("wrong event passed on emit.");
  }
};

// Subscribe and listen to all the events coming up from the iframe
subject.subscribe((data: any) => {
  listenToEvent(data.event, data?.callBack);
});


// Listen event callback handler
const listenToEvent = (
  XREvent: XrEventType,
  callback?: (XREvent: any) => void
) => {
  if (Object.keys(XrTypes).includes(XREvent)) {
    alert(XREvent);
    callbackHandler(XREvent, callback);
  } else {
    console.error("unsupported event.");
  }
};

// Iframe callback handler
const callbackHandler = (event: XrEventType, callback?: Function) => {
  if (Object.keys(XrTypes).includes(event)) {
    callback?.(event);
  }
};