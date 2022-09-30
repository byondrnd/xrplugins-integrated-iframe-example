import configs from "./config.json";
console.log(configs, "configs");
const data = {
    type: "init",
    theming: {
        primaryColor: "blue",
    },
    config: {
        button: "trigger",
    },
};
const allowedEvents = ["xr_add_to_cart"];
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
const listenToEvent = (XREvents) => {
    if (allowedEvents.includes(XREvents)) {
        parent.addEventListener("message", messages);
    }
    else {
        console.error("unsupported event.");
    }
};
const iframe = document.querySelector(".inte-iframe") || null;
iframe.src = "../Iframe.html";
const initBtn = document.querySelector(".inte-init-btn");
const changeIframe = () => {
    const iframeValue = document.getElementById("inte-input-frame");
    iframeValue && (iframe.src = iframeValue.value);
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
    var _a;
    const type = document.querySelector(".inte-input");
    const typeValue = type === null || type === void 0 ? void 0 : type.value;
    const eventData = document.querySelector(".inte-data");
    const eventValue = eventData === null || eventData === void 0 ? void 0 : eventData.value;
    const data = {
        type: typeValue,
        data: eventValue,
    };
    (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
        data,
    }, "*");
};
generateBtn.onclick = generateEvent;
const init = () => {
    const iWindow = (iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) || null;
    if (iWindow) {
        logEvents("init");
        iWindow.emitEvent = emitEvent;
        iWindow.listenToEvent = listenToEvent;
        iWindow.postMessage({
            data,
        }, "*");
    }
};
iframe.onload = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYy8iLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLE9BQU8sTUFBTSxlQUFlLENBQUM7QUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDL0IsTUFBTSxJQUFJLEdBQW1CO0lBQzNCLElBQUksRUFBRSxNQUFNO0lBQ1osT0FBTyxFQUFFO1FBQ1AsWUFBWSxFQUFFLE1BQU07S0FDckI7SUFDRCxNQUFNLEVBQUU7UUFDTixNQUFNLEVBQUUsU0FBUztLQUNsQjtDQUNGLENBQUM7QUFDRixNQUFNLGFBQWEsR0FBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTFELE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFO0lBQ3JDLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDekMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3RDO1NBQU07UUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDOUM7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQXFCLEVBQUUsRUFBRTtJQUN6QyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRyxDQUFDLFFBQWtCLEVBQUUsRUFBRTtJQUMzQyxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDcEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztL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