import { XrTypes, } from "./types";
const jsonModule = await import("./config.json", {
    assert: { type: "json" },
});
const data = jsonModule.default;
const emitEvent = (XREvent) => {
    if (Object.keys(XrTypes).includes(XREvent.event)) {
        console.log(XREvent, "xr");
        parent.postMessage({ XREvent }, "*");
        eventLogger(XREvent);
    }
    else {
        console.error("wrong event passed on emit.");
    }
};
const callbackHandler = (event, callback) => {
    if (Object.keys(XrTypes).includes(event)) {
        callback(event);
    }
};
const listenToEvent = (XREvents, callback) => {
    if (Object.keys(XrTypes).includes(XREvents)) {
        callbackHandler(XREvents, callback);
    }
    else {
        console.error("unsupported event.");
    }
};
const iframe = document.querySelector(".inte-iframe") || null;
iframe.src = "./plugin.html";
const iframeInput = document.querySelector("#inte-input-frame");
iframeInput.value = "plugin.html";
iframeInput.innerText = "plugin.html";
const initBtn = document.querySelector(".inte-init-btn");
const initCalled = () => {
    const iWindow = iframe?.contentWindow || null;
    if (iWindow) {
        iWindow.emitEvent = emitEvent;
        iWindow.listenToEvent = listenToEvent;
    }
    iWindow.postMessage({
        data,
    }, "*");
    eventLogger({
        event: "init",
        from: "playground",
    });
    iframe.removeEventListener("click", initCalled);
};
const changeIframe = () => {
    const iframeValue = document.getElementById("inte-input-frame");
    if (iframeValue) {
        iframe.src = iframeValue.value;
        iframe.addEventListener("load", initCalled);
    }
};
initBtn.addEventListener("click", changeIframe);
const eventLogger = (e) => {
    const eventLoggerDiv = document.querySelector(".inte-event-logger-div");
    const p = document.createElement("p");
    if (e.from === "playground") {
        p.style.color = "blue";
    }
    else {
        p.style.color = "orange";
    }
    p.innerText = "=>" + JSON.stringify(e.event);
    eventLoggerDiv.appendChild(p);
};
const generateBtn = document.querySelector(".inte-generate-button");
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
    iframe.contentWindow?.postMessage({
        data,
    }, "*");
};
generateBtn.onclick = generateEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWdyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMvIiwic291cmNlcyI6WyJwbGF5Z3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxPQUFPLEdBSVIsTUFBTSxTQUFTLENBQUM7QUFFakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxNQUFNLENBQUMsZUFBZSxFQUFFO0lBQy9DLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxJQUFJLEdBQW1CLFVBQVUsQ0FBQyxPQUFPLENBQUM7QUFFaEQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUU7SUFDckMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN0QjtTQUFNO1FBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQzlDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFhLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQzVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUFnQixFQUFFLFFBQWdDLEVBQUUsRUFBRTtJQUMzRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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