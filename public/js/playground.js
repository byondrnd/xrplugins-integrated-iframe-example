import { XrTypes, } from "./types";
const jsonScheme = await import("./jsonSchemaTest.json", {
    assert: { type: "json" },
});
let dataArray = [];
let count = 0;
const createInput = (value, count, key) => {
    const inputDiv = document.createElement("div");
    if (value.title) {
        const inputLabel = document.createElement("label");
        inputLabel.innerText = value.title;
        inputDiv.append(inputLabel);
    }
    inputDiv.classList.add("inte-inputs");
    const input = document.createElement("input");
    value?.format == "date" && (input.type = "date");
    if (value?.text) {
        input.value = value.text;
    }
    else {
        input.value = "";
    }
    input.name = key;
    value?.placeHolder && (input.placeholder = value.placeHolder);
    input.classList.add("inte-input-frame");
    inputDiv.append(input);
    return inputDiv;
};
const radiobuilder = (value, key) => {
    const formDivRadio = document.createElement("div");
    formDivRadio.classList.add("inte-inputs-radio");
    const radio = document.createElement("input");
    radio.value = value;
    radio.type = "radio";
    radio.name = key;
    radio.id = value;
    formDivRadio.append(radio);
    const label = document.createElement("label");
    label.setAttribute("for", value);
    label.textContent = value;
    formDivRadio.append(label);
    return formDivRadio;
};
const selectionBuilder = (values, key) => {
    const select = document.createElement("select");
    select.name = key;
    values?.enum?.map((elem) => {
        const option = document.createElement("option");
        option.text = elem;
        select?.append(option);
    });
    return select;
};
const createRadio = (radioDiv, options, key, labelText) => {
    const mainRadioDiv = document.createElement("div");
    mainRadioDiv.classList.add("inte-radio-input-main");
    if (labelText) {
        const radioLabel = document.createElement("label");
        radioLabel.innerText = labelText;
        mainRadioDiv.append(radioLabel);
    }
    Object.entries(options)?.map((elem) => {
        const inputDiv = radiobuilder(elem[1], key);
        mainRadioDiv.append(inputDiv);
    });
    radioDiv.append(mainRadioDiv);
};
const textareaBuilder = (value, key) => {
    const textareaMainDiv = document.createElement("div");
    if (value?.title) {
        const textareaLabel = document.createElement("label");
        textareaLabel.classList.add("textarea-label");
        textareaLabel.innerText = value.title;
        textareaMainDiv.append(textareaLabel);
    }
    textareaMainDiv.classList.add("textarea-main-div");
    const textarea = document.createElement("textarea");
    key && (textarea.name = key);
    textarea.classList.add("inte-textarea");
    value.col && (textarea.cols = Number(value.col));
    value.row && (textarea.rows = Number(value.row));
    value.placeHolder && (textarea.placeholder = value.placeHolder);
    textareaMainDiv.append(textarea);
    return textareaMainDiv;
};
const formCreation = (values, MainformDiv, count, key) => {
    const formDiv = document.createElement("div");
    formDiv.classList.add("inte-inputs");
    if (values.type == "string") {
        const inputString = createInput(values, count, key);
        formDiv?.append(inputString);
        MainformDiv?.append(formDiv);
    }
    else if (values.type == "selection") {
        const select = selectionBuilder(values, key);
        formDiv.append(select);
        MainformDiv.append(formDiv);
    }
    else if (values.type == "radio") {
        const options = Object(values.options);
        const labelText = values.title;
        createRadio(MainformDiv, options, key, labelText);
    }
    else if (values.type == "textarea") {
        const textarea = textareaBuilder(values, key);
        MainformDiv.append(textarea);
    }
};
const form = document.createElement("form");
form.id = "myForm";
form.classList.add("form-list");
const MainformDiv = document.createElement("div");
MainformDiv.classList.add("inte-form-div");
const dataObj = {};
const generateChildJson = (json) => {
    let childObj = {};
    if (json.type != "string") {
        for (const [key, value] of Object.entries(json)) {
            let data = value;
            if (data[key] != "string" || data[key] != "selection") {
                if (data["type"] == "string" || data["type"] == "selection") {
                    childObj[key] = "";
                }
                else if (data.type == "object") {
                    let val = generateChildJson(data);
                    childObj[key] = val;
                }
            }
            else {
                childObj[key] = "";
            }
        }
        return childObj;
    }
};
const generateEmptyJson = (json) => {
    for (const [key, value] of Object.entries(json)) {
        if (key != "keyType") {
            let data = value;
            if (data["type"] != "string") {
                dataObj[key] = typeof value === "object" ? {} : "";
                if (dataObj[key]) {
                    let obj = value;
                    for (const [childKey, value] of Object.entries(obj)) {
                        let dataVal = value;
                        if (dataVal != "object") {
                            dataObj[key][childKey] = generateChildJson(value);
                        }
                    }
                }
            }
            else {
                if (key != "type")
                    dataObj[key] = "";
            }
        }
        else {
            dataObj["keyType"] = value;
        }
    }
};
function addDynamicForms(jsonObject, isChild, remove) {
    if (count == 0) {
        MainformDiv.innerHTML = "";
    }
    const schemaForm = document.querySelector(".inte-schema-form");
    const checkIfDivExist = document.querySelector(".form-list");
    if (checkIfDivExist && remove) {
        checkIfDivExist.remove();
        dataArray = [];
    }
    for (const [key, value] of Object.entries(jsonObject)) {
        const values = value;
        formCreation(values, MainformDiv, count, key);
        if (values.type == "object") {
            addDynamicForms(values, true, false);
        }
        count = count + 1;
    }
    if (dataArray.length > 0) {
        dataArray.forEach((elem) => {
            MainformDiv.append(elem);
        });
    }
    form.append(MainformDiv);
    schemaForm.append(form);
    count = 0;
}
async function formBuilder() {
    const jsonSchema = document.querySelector("#inte-input-schema");
    const schema = jsonSchema.value;
    const getSchemaData = await fetch(schema);
    const json = await getSchemaData.json();
    const jsonSchemaObj = schema !== "" ? json : jsonScheme.default;
    if (jsonSchemaObj) {
        generateEmptyJson(jsonSchemaObj);
        addDynamicForms(jsonSchemaObj, false, true);
    }
}
const copyToClipboardButton = document.querySelector(".inte-copy-text");
function eachRecursive(obj) {
    for (var k in obj) {
        const form = new FormData(document.getElementById("myForm"));
        for (const [key, val] of form) {
            if (key === k)
                obj[key] = val;
        }
        if (typeof obj[k] == "object" && obj[k] !== null) {
            eachRecursive(obj[k]);
        }
        else {
            for (const [key, val] of form) {
                if (key === k)
                    obj[key] = val;
            }
        }
    }
}
function copyToClipboard() {
    eachRecursive(dataObj);
    navigator.clipboard.writeText(JSON.stringify(dataObj));
}
copyToClipboardButton.addEventListener("click", copyToClipboard);
const generateFormButton = document.querySelector(".inte-generate-btn");
generateFormButton.addEventListener("click", formBuilder);
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
function isEmpty(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}
// Initialize iframe source and trigger init event inside it
const initCalled = () => {
    const iWindow = iframe?.contentWindow || null;
    if (iWindow) {
        // Inject emit and listen functions
        iWindow.emitEvent = emitEvent;
        iWindow.listenToEvent = listenToEvent;
        // Trigger init event inside the iframe
        eachRecursive(dataObj);
        if (!isEmpty(dataObj)) {
            iWindow.postMessage({
                dataObj,
            }, "*");
        }
        else {
            iWindow.postMessage({
                data,
            }, "*");
        }
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
const changeIframe = (e) => {
    e.preventDefault();
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
    eventLoggerDiv.append(p);
};
const generateBtn = document.querySelector(".inte-generate-button");
// Custom event generator function which emits event inside the iframe
const generateEvent = () => {
    const type = document.querySelector(".inte-input");
    const typeValue = type?.value;
    const eventData = document.querySelector(".inte-data");
    const eventValue = eventData?.value;
    const parsedValue = JSON.parse(eventValue);
    const data = {
        event: typeValue,
        data: parsedValue,
        from: "playground",
    };
    iframe?.contentWindow?.postMessage({
        data,
    }, "*");
};
generateBtn.onclick = generateEvent;
// Emits event from iframe to playground and pass the XREvent object
const emitEvent = (XREvent) => {
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
        alert("Plugin will listen to " + XREvent + " from now on wards");
        iframe.contentWindow?.addEventListener("message", function (e) {
            if (e.data.data.event === XREvent || e.data.event === XREvent) {
                const XrEventData = e.data.data.event ? e.data.data : e.data;
                callbackHandler(XrEventData, callback);
            }
        });
    }
    else {
        console.error("unsupported event.");
    }
};
// Iframe callback handler
const callbackHandler = (XRevent, callback) => {
    const xrEvent = XRevent.event;
    if (Object.keys(XrTypes).includes(xrEvent)) {
        callback?.(XRevent.data);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWdyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMvIiwic291cmNlcyI6WyJwbGF5Z3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxPQUFPLEdBS1IsTUFBTSxTQUFTLENBQUM7QUFFakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxNQUFNLENBQUMsdUJBQXVCLEVBQUU7SUFDdkQsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFJLFNBQVMsR0FBdUIsRUFBRSxDQUFDO0FBQ3ZDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxHQUFXLEVBQUUsRUFBRTtJQUNoRSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBbUIsQ0FBQztJQUNqRSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDZixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztRQUN2RSxVQUFVLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbkMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3QjtJQUNELFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO0lBQ2xFLEtBQUssRUFBRSxNQUFNLElBQUksTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztJQUNqRCxJQUFJLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDZixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7S0FDMUI7U0FBTTtRQUNMLEtBQUssQ0FBQyxL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