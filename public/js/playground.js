const { Subject } = rxjs;
import { XrTypes, } from "./types";
const subject = new Subject();
// Gather plugin configuration
const jsonModule = await import("./config.json", {
    assert: { type: "json" },
});
const data = jsonModule.default;
// Set Iframe and initial plugin.html source
const iframe = document.querySelector(".inte-iframe") || null;
iframe.src = "../plugin/plugin.html";
const iframeInput = document.querySelector("#inte-input-frame");
iframeInput.value = "../plugin/plugin.html";
iframeInput.innerText = "../plugin/plugin.html";
const initBtn = document.querySelector(".inte-init-btn");
// Initialize iframe source and trigger init event inside it
const initCalled = () => {
    const iWindow = iframe?.contentWindow || null;
    if (iWindow) {
        // Inject emit and listen functions
        iWindow.emitEvent = emitEvent;
        iWindow.listenToEvent = listenToEvent;
        // Trigger init event inside the iframe
        iWindow.postMessage({
            data,
        }, "*");
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
    const iframeValue = document.getElementById("inte-input-frame");
    if (iframeValue) {
        iframe.src = iframeValue.value;
        iframe.addEventListener("load", initCalled);
    }
};
initBtn.addEventListener("click", changeIframe);
// Log the messsages inside the playground
const eventLogger = (e) => {
    const eventLoggerDiv = document.querySelector(".inte-event-logger-div");
    const p = document.createElement("p");
    if (e.from === "playground") {
        p.style.color = "blue";
    }
    else {
        p.style.color = "orange";
    }
    p.innerText = "=>" + e.event;
    eventLoggerDiv.appendChild(p);
};
const generateBtn = document.querySelector(".inte-generate-button");
// Custom event generator function which emits event inside the iframe
const generateEvent = () => {
    const type = document.querySelector(".inte-input");
    const typeValue = type?.value;
    const eventData = document.querySelector(".inte-data");
    const eventValue = eventData?.value;
    const data = {
        event: typeValue,
        data: eventValue,
        from: "playground",
    };
    if (data.event) {
        subject.next(data);
    }
    iframe.contentWindow?.postMessage({
        data,
    }, "*");
};
generateBtn.onclick = generateEvent;
// Emits event from iframe to playground and pass the XREvent object
const emitEvent = (XREvent) => {
    if (Object.keys(XrTypes).includes(XREvent.event)) {
        eventLogger(XREvent);
        subject.next(XREvent);
    }
    else {
        console.error("wrong event passed on emit.");
    }
};
// Subscribe and listen to all the events coming up from the iframe
subject.subscribe((data) => {
    listenToEvent(data.event, data?.callBack);
});
// Listen event callback handler
const listenToEvent = (XREvent, callback) => {
    if (Object.keys(XrTypes).includes(XREvent)) {
        alert(XREvent);
        callbackHandler(XREvent, callback);
    }
    else {
        console.error("unsupported event.");
    }
};
// Iframe callback handler
const callbackHandler = (event, callback) => {
    if (Object.keys(XrTypes).includes(event)) {
        callback?.(event);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWdyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMvIiwic291cmNlcyI6WyJwbGF5Z3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFekIsT0FBTyxFQUVMLE9BQU8sR0FJUixNQUFNLFNBQVMsQ0FBQztBQUVqQixNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBRTlCLDhCQUE4QjtBQUM5QixNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLEVBQUU7SUFDL0MsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtDQUN6QixDQUFDLENBQUM7QUFLSCxNQUFNLElBQUksR0FBbUIsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUVoRCw0Q0FBNEM7QUFDNUMsTUFBTSxNQUFNLEdBQ1QsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXVCLElBQUksSUFBSSxDQUFDO0FBQ3hFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsdUJBQXVCLENBQUM7QUFDckMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDeEMsbUJBQW1CLENBQ0EsQ0FBQztBQUN0QixXQUFXLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUFDO0FBQzVDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsdUJBQXVCLENBQUM7QUFDaEQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBc0IsQ0FBQztBQUc5RSw0REFBNEQ7QUFDNUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFO0lBQ3RCLE1BQU0sT0FBTyxHQUFJLE1BQU0sRUFBRSxhQUE4QixJQUFJLElBQUksQ0FBQztJQUNoRSxJQUFJLE9BQU8sRUFBRTtRQUVYLG1DQUFtQztRQUNuQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUM5QixPQUFPLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FB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