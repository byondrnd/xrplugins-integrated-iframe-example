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
const textareaBuilder = (value) => {
    const textareaMainDiv = document.createElement("div");
    if (value?.title) {
        const textareaLabel = document.createElement("label");
        textareaLabel.classList.add("textarea-label");
        textareaLabel.innerText = value.title;
        textareaMainDiv.append(textareaLabel);
    }
    textareaMainDiv.classList.add("textarea-main-div");
    const textarea = document.createElement("textarea");
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
        const textarea = textareaBuilder(values);
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
            if (data[key] != "string") {
                if (data["type"] == "string") {
                    childObj[key] = "";
                }
                else if (data != "object") {
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
function copyToClipboard() {
    const form = new FormData(document.getElementById("myForm"));
    let object = {};
    for (const [key, value] of form) {
        object[key] = value;
    }
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