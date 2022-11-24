import { XrTypes, } from "./types";
const jsonScheme = await import("./jsonSchemaTest.json", {
    assert: { type: "json" },
});
let Initialize = false;
let emittedEvents = [];
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
    emittedEvents = [];
    const iWindow = iframe?.contentWindow || null;
    if (iWindow) {
        Initialize = true;
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
window.parent.eventLogger = eventLogger;
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
    if (Object.keys(XrTypes).includes(typeValue) &&
        emittedEvents.includes(typeValue)) {
        iframe?.contentWindow?.postMessage({
            event: typeValue,
            data: parsedValue,
        }, "*");
        eventLogger(data);
    }
};
generateBtn.onclick = generateEvent;
// Emits event from iframe to playground and pass the XREvent object
const emitEvent = (XREvent) => {
    if (Object.keys(XrTypes).includes(XREvent.event) && Initialize == true) {
        listenToEvent(XREvent);
    }
};
//Listen To event from iframe to playground events.
const listenToEvent = (XREvent) => {
    eventLogger(XREvent);
    alert("callBack called playground");
};
// Subscribe and listen to emitEvent
parent.addEventListener("message", function (e) {
    if (e.data.eventType == "emit") {
        if (!emittedEvents.includes(e.data.event)) {
            emittedEvents.push(e.data.event);
        }
        emitEvent(e.data);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWdyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMvIiwic291cmNlcyI6WyJwbGF5Z3JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxPQUFPLEdBS1IsTUFBTSxTQUFTLENBQUM7QUFFakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxNQUFNLENBQUMsdUJBQXVCLEVBQUU7SUFDdkQsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtDQUN6QixDQUFDLENBQUM7QUFFSCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFFdkIsSUFBSSxhQUFhLEdBQUcsRUFBYyxDQUFDO0FBUW5DLElBQUksU0FBUyxHQUF1QixFQUFFLENBQUM7QUFDdkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEdBQVcsRUFBRSxFQUFFO0lBQ2hFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFtQixDQUFDO0lBQ2pFLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtRQUNmLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ3ZFLFVBQVUsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNuQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdCO0lBQ0QsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQXFCLENBQUM7SUFDbEUsS0FBSyxFQUFFLE1BQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELElBQUksS0FBSyxFQUFFLElBQUksRUFBRTtRQUNmLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztLQUMxQjtTQUFNO1FBQ0wsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDbEI7SUFDRCxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztJQUNqQixLQUFLLEVBQUUsV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4QyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQVcsRUFBRSxFQUFFO0lBQ2xELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFtQixDQUFDO0lBQ3JFLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDaEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQXFCLENBQUM7SUFDbEUsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDcEIsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFDckIsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDakIsS0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDakIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztJQUNsRSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqQyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMxQixZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDdkQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQXNCLENBQUM7SUFDckUsTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDbEIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUN6QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixNQUFNLFdBQVcsR0FBRyxDQUNsQixRQUFhLEVBQ2IsT0FBWSxFQUNaLEdBQVcsRUFDWCxTQUFrQixFQUNsQixFQUFFO0lBQ0YsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQW1CLENBQUM7SUFDckUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUNwRCxJQUFJLFNBQVMsRUFBRTtRQUNiLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ3ZFLFVBQVUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDakM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBWSxFQUFFLEVBQUU7SUFDdEQsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQW1CLENBQUM7SUFDeEUsSUFBSSxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQ2hCLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQzFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3RDLGVBQWUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDdkM7SUFDRCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUF3QixDQUFDO0lBQzNFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDN0IsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDeEMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pELEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRCxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDLENBQUM7QUFFRixNQUFNLFlBQVksR0FBRyxDQUNuQixNQUFjLEVBQ2QsV0FBZ0IsRUFDaEIsS0FBYSxFQUNiLEdBQVcsRUFDWCxFQUFFO0lBQ0YsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO1FBQzNCLE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0IsV0FBVyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM5QjtTQUFNLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxXQUFXLEVBQUU7UUFDckMsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM3QjtTQUFNLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7UUFDakMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQy9CLFdBQVcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNuRDtTQUFNLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUU7UUFDcEMsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzlCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQW9CLENBQUM7QUFDL0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUM7QUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFaEMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQW1CLENBQUM7QUFDcEUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDM0MsTUFBTSxPQUFPLEdBQUcsRUFBUyxDQUFDO0FBRTFCLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtJQUN0QyxJQUFJLFFBQVEsR0FBRyxFQUFTLENBQUM7SUFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtRQUN6QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQyxJQUFJLElBQUksR0FBRyxLQUFZLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxXQUFXLEVBQUU7Z0JBQ3JELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFO29CQUMzRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNwQjtxQkFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO29CQUNoQyxJQUFJLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztpQkFDckI7YUFDRjtpQkFBTTtnQkFDTCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ3BCO1NBQ0Y7UUFDRCxPQUFPLFFBQVEsQ0FBQztLQUNqQjtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtJQUN0QyxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMvQyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7WUFDcEIsSUFBSSxJQUFJLEdBQUcsS0FBWSxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsRUFBRTtnQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ25ELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNoQixJQUFJLEdBQUcsR0FBRyxLQUFZLENBQUM7b0JBQ3ZCLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNuRCxJQUFJLE9BQU8sR0FBRyxLQUFZLENBQUM7d0JBQzNCLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTs0QkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUNuRDtxQkFDRjtpQkFDRjthQUNGO2lCQUFNO2dCQUNMLElBQUksR0FBRyxJQUFJLE1BQU07b0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUN0QztTQUNGO2FBQU07WUFDTCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzVCO0tBQ0Y7QUFDSCxDQUFDLENBQUM7QUFFRixTQUFTLGVBQWUsQ0FBQyxVQUFlLEVBQUUsT0FBaUIsRUFBRSxNQUFnQjtJQUMzRSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDZCxXQUFXLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztLQUM1QjtJQUNELE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQ3ZDLG1CQUFtQixDQUNGLENBQUM7SUFDcEIsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDNUMsWUFBWSxDQUNLLENBQUM7SUFFcEIsSUFBSSxlQUFlLElBQUksTUFBTSxFQUFFO1FBQzdCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQ2hCO0lBRUQsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDckQsTUFBTSxNQUFNLEdBQUcsS0FBZSxDQUFDO1FBQy9CLFlBQVksQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO1lBQzNCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDbkI7SUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3hCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN6QixXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pCLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNaLENBQUM7QUFFRCxLQUFLLFVBQVUsV0FBVztJQUN4QixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUN2QyxvQkFBb0IsQ0FDRCxDQUFDO0lBQ3RCLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7SUFDaEMsTUFBTSxhQUFhLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEMsTUFBTSxhQUFhLEdBQUcsTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQ2hFLElBQUksYUFBYSxFQUFFO1FBQ2pCLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdDO0FBQ0gsQ0FBQztBQUVELE1BQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDbEQsaUJBQWlCLENBQ0EsQ0FBQztBQUVwQixTQUFTLGFBQWEsQ0FBQyxHQUFRO0lBQzdCLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxDQUN2QixRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBb0IsQ0FDckQsQ0FBQztRQUNGLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDN0IsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNoRCxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7Z0JBQzdCLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUMvQjtTQUNGO0tBQ0Y7QUFDSCxDQUFDO0FBRUQsU0FBUyxlQUFlO0lBQ3RCLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUVELHFCQUFxQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztBQUVqRSxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQy9DLG9CQUFvQixDQUNBLENBQUM7QUFFdkIsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRTFELDhCQUE4QjtBQUM5QixNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLEVBQUU7SUFDL0MsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtDQUN6QixDQUFDLENBQUM7QUFLSCxNQUFNLElBQUksR0FBbUIsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUVoRCw0Q0FBNEM7QUFDNUMsTUFBTSxNQUFNLEdBQ1QsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXVCLElBQUksSUFBSSxDQUFDO0FBQ3hFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsdUJBQXVCLENBQUM7QUFDckMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBc0IsQ0FBQztBQUU5RSxTQUFTLE9BQU8sQ0FBQyxHQUFRO0lBQ3ZCLEtBQUssSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO1FBQ3BCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNuRCxPQUFPLEtBQUssQ0FBQztTQUNkO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBQ0QsNERBQTREO0FBQzVELE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRTtJQUN0QixhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE1BQU0sT0FBTyxHQUFJLE1BQU0sRUFBRSxhQUE4QixJQUFJLElBQUksQ0FBQztJQUNoRSxJQUFJLE9BQU8sRUFBRTtRQUNYLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFbEIsdUNBQXVDO1FBQ3ZDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sQ0FBQyxXQUFXLENBQ2pCO2dCQUNFLE9BQU87YUFDUixFQUNELEdBQUcsQ0FDSixDQUFDO1NBQ0g7YUFBTTtZQUNMLE9BQU8sQ0FBQyxXQUFXLENBQ2pCO2dCQUNFLElBQUk7YUFDTCxFQUNELEdBQUcsQ0FDSixDQUFDO1NBQ0g7S0FDRjtJQUVELDhDQUE4QztJQUM5QyxXQUFXLENBQUM7UUFDVixLQUFLLEVBQUUsTUFBTTtRQUNiLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFlBQVk7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUM7QUFFRiwyQkFBMkI7QUFDM0IsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRTtJQUM5QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFbkIsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDekMsa0JBQWtCLENBQ0MsQ0FBQztJQUV0QixJQUFJLFdBQVcsRUFBRTtRQUNmLE1BQU0sQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUMvQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzdDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUVoRCwwQ0FBMEM7QUFDMUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRTtJQUM3QixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUMzQyx3QkFBd0IsQ0FDUCxDQUFDO0lBRXBCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUMzQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7S0FDeEI7U0FBTTtRQUNMLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztLQUMxQjtJQUNELENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFFN0IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBYyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFFakQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDeEMsdUJBQXVCLENBQ0gsQ0FBQztBQUV2QixzRUFBc0U7QUFDdEUsTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFO0lBQ3pCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFxQixDQUFDO0lBQ3ZFLE1BQU0sU0FBUyxHQUFHLElBQUksRUFBRSxLQUFLLENBQUM7SUFDOUIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQXdCLENBQUM7SUFDOUUsTUFBTSxVQUFVLEdBQUcsU0FBUyxFQUFFLEtBQVksQ0FBQztJQUMzQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRTNDLE1BQU0sSUFBSSxHQUFvQjtRQUM1QixLQUFLLEVBQUUsU0FBUztRQUNoQixJQUFJLEVBQUUsV0FBVztRQUNqQixJQUFJLEVBQUUsWUFBWTtLQUNuQixDQUFDO0lBQ0YsSUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDeEMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFDakM7UUFDQSxNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FDaEM7WUFDRSxLQUFLLEVBQUUsU0FBUztZQUNoQixJQUFJLEVBQUUsV0FBVztTQUNsQixFQUNELEdBQUcsQ0FDSixDQUFDO1FBQ0YsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsV0FBVyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7QUFFcEMsb0VBQW9FO0FBQ3BFLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFO0lBQ3JDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7UUFDdEUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsbURBQW1EO0FBRW5ELE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFO0lBQ3pDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRixvQ0FBb0M7QUFFcEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7SUFDNUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNLEVBQUU7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7UUFDRCxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==