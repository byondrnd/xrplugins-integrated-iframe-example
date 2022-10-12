import { XrTypes, } from "./types";
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
    emitEvent(data);
    iframe.contentWindow?.postMessage({
        data,
    }, "*");
};
generateBtn.onclick = generateEvent;
// Emits event from iframe to playground and pass the XREvent object
const emitEvent = (XREvent) => {
    console.log(XREvent.event, "event");
    if (Object.keys(XrTypes).includes(XREvent.event)) {
        eventLogger(XREvent);
        iframe.contentWindow?.postMessage(XREvent);
    }
    else {
        console.error("wrong event passed on emit.");
    }
};
// Subscribe and listen to all the events coming up from the iframe
// Listen event callback handler
const listenToEvent = (XREvent, callback) => {
    if (Object.keys(XrTypes).includes(XREvent)) {
        iframe.contentWindow?.addEventListener("message", function (e) {
            if (e.data.event === XREvent) {
                callbackHandler(XREvent, callback);
            }
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWdyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMvIiwic291cmNlcyI6WyJwbGF5Z3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxPQUFPLEdBSVIsTUFBTSxTQUFTLENBQUM7QUFFakIsOEJBQThCO0FBQzlCLE1BQU0sVUFBVSxHQUFHLE1BQU0sTUFBTSxDQUFDLGVBQWUsRUFBRTtJQUMvQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0NBQ3pCLENBQUMsQ0FBQztBQUtILE1BQU0sSUFBSSxHQUFtQixVQUFVLENBQUMsT0FBTyxDQUFDO0FBRWhELDRDQUE0QztBQUM1QyxNQUFNLE1BQU0sR0FDVCxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBdUIsSUFBSSxJQUFJLENBQUM7QUFDeEUsTUFBTSxDQUFDLEdBQUcsR0FBRyx1QkFBdUIsQ0FBQztBQUNyQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUN4QyxtQkFBbUIsQ0FDQSxDQUFDO0FBQ3RCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsdUJBQXVCLENBQUM7QUFDNUMsV0FBVyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUNoRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFzQixDQUFDO0FBRTlFLDREQUE0RDtBQUM1RCxNQUFNLFVBQVUsR0FBRyxHQUFHLEVBQUU7SUFDdEIsTUFBTSxPQUFPLEdBQUksTUFBTSxFQUFFLGFBQThCLElBQUksSUFBSSxDQUFDO0lBQ2hFLElBQUksT0FBTyxFQUFFO1FBQ1gsbUNBQW1DO1FBQ25DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBRXRDLHVDQUF1QztRQUN2QyxPQUFPLENBQUMsV0FBVyxDQUNqQjtZQUNFLElBQUk7U0FDTCxFQUNELEdBQUcsQ0FDSixDQUFDO0tBQ0g7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