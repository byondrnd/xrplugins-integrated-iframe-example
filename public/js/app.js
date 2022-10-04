const jsonModule = await import("./config.json", {
    assert: { type: "json" },
});
const data = jsonModule.default;
const allowedEvents = [
    "xr_add_to_cart",
    "xr_remove_cart",
    "xr_open",
];
const emitEvent = (XREvent) => {
    if (allowedEvents.includes(XREvent.event)) {
        parent.postMessage({ XREvent }, "*");
    }
    else {
        console.error("wrong event passed on emit.");
    }
};
const messages = (message) => {
    logEvents(message.data.XREvent.event);
    parent.removeEventListener("message", messages);
};
const listenToEvent = (XREvents, callback) => {
    if (allowedEvents.includes(XREvents)) {
        parent.addEventListener("message", messages);
        const result = {
            event: "xr_get_product",
            product: "proudct_2",
        };
        callback(result);
    }
    else {
        console.error("unsupported event.");
    }
};
const iframe = document.querySelector(".inte-iframe") || null;
iframe.src = "./plugin.html";
const iframeInput = document.querySelector("#inte-input-frame");
console.log(iframeInput, "iframe");
iframeInput.value = "plugin.html";
iframeInput.innerText = "plugin.html";
const initBtn = document.querySelector(".inte-init-btn");
const changeIframe = () => {
    const iframeValue = document.getElementById("inte-input-frame");
    if (iframeValue) {
        iframe.src = iframeValue.value;
        iframe.onload = init;
        const iWindow = iframe?.contentWindow || null;
        iframe.addEventListener("load", function () {
            iWindow.postMessage({
                data,
            }, "*");
        });
        logEvents("init");
    }
};
initBtn.addEventListener("click", changeIframe);
const logEvents = (e) => {
    const eventLoggerDiv = document.querySelector(".inte-event-logger-div");
    const p = document.createElement("p");
    p.innerText = "=>" + JSON.stringify(e);
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
    };
    iframe.contentWindow?.postMessage({
        data,
    }, "*");
};
generateBtn.onclick = generateEvent;
const init = () => {
    const iWindow = iframe?.contentWindow || null;
    if (iWindow) {
        iWindow.emitEvent = emitEvent;
        iWindow.listenToEvent = listenToEvent;
    }
};
iframe.onload = init;
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYy8iLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLEVBQUU7SUFDL0MsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtDQUN6QixDQUFDLENBQUM7QUFFSCxNQUFNLElBQUksR0FBbUIsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUNoRCxNQUFNLGFBQWEsR0FBb0I7SUFDckMsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixTQUFTO0NBQ1YsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFO0lBQ3JDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDekMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3RDO1NBQU07UUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDOUM7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQXFCLEVBQUUsRUFBRTtJQUN6QyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRyxDQUNwQixRQUFrQixFQUNsQixRQUFnQyxFQUNoQyxFQUFFO0lBQ0YsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0MsTUFBTSxNQUFNLEdBQUc7WUFDYixLQUFLLEVBQUUs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