import {
  XREvent,
  XrTypes,
  CustomWindow,
  configurations,
  customEventType,
  values,
} from "./types";

const jsonScheme = await import("./jsonSchemaTest.json", {
  assert: { type: "json" },
});

let Initialize = false;

let emittedEvents = [] as string[];

declare global {
  interface Window {
    MyNamespace: any;
  }
}

let dataArray: Array<HTMLElement> = [];
let count = 0;
const createInput = (value: values, count: number, key: string) => {
  const inputDiv = document.createElement("div") as HTMLDivElement;
  if (value.title) {
    const inputLabel = document.createElement("label") as HTMLLabelElement;
    inputLabel.innerText = value.title;
    inputDiv.append(inputLabel);
  }
  inputDiv.classList.add("inte-inputs");
  const input = document.createElement("input") as HTMLInputElement;
  value?.format == "date" && (input.type = "date");
  if (value?.text) {
    input.value = value.text;
  } else {
    input.value = "";
  }
  input.name = key;
  value?.placeHolder && (input.placeholder = value.placeHolder);
  input.classList.add("inte-input-frame");
  inputDiv.append(input);
  return inputDiv;
};

const radiobuilder = (value: string, key: string) => {
  const formDivRadio = document.createElement("div") as HTMLDivElement;
  formDivRadio.classList.add("inte-inputs-radio");
  const radio = document.createElement("input") as HTMLInputElement;
  radio.value = value;
  radio.type = "radio";
  radio.name = key;
  radio.id = value;
  formDivRadio.append(radio);
  const label = document.createElement("label") as HTMLLabelElement;
  label.setAttribute("for", value);
  label.textContent = value;
  formDivRadio.append(label);
  return formDivRadio;
};

const selectionBuilder = (values: values, key: string) => {
  const select = document.createElement("select") as HTMLSelectElement;
  select.name = key;
  values?.enum?.map((elem) => {
    const option = document.createElement("option");
    option.text = elem;
    select?.append(option);
  });
  return select;
};

const createRadio = (
  radioDiv: any,
  options: any,
  key: string,
  labelText?: string
) => {
  const mainRadioDiv = document.createElement("div") as HTMLDivElement;
  mainRadioDiv.classList.add("inte-radio-input-main");
  if (labelText) {
    const radioLabel = document.createElement("label") as HTMLLabelElement;
    radioLabel.innerText = labelText;
    mainRadioDiv.append(radioLabel);
  }
  Object.entries(options)?.map((elem: any) => {
    const inputDiv = radiobuilder(elem[1], key);
    mainRadioDiv.append(inputDiv);
  });
  radioDiv.append(mainRadioDiv);
};

const textareaBuilder = (value: values, key?: string) => {
  const textareaMainDiv = document.createElement("div") as HTMLDivElement;
  if (value?.title) {
    const textareaLabel = document.createElement("label") as HTMLLabelElement;
    textareaLabel.classList.add("textarea-label");
    textareaLabel.innerText = value.title;
    textareaMainDiv.append(textareaLabel);
  }
  textareaMainDiv.classList.add("textarea-main-div");
  const textarea = document.createElement("textarea") as HTMLTextAreaElement;
  key && (textarea.name = key);
  textarea.classList.add("inte-textarea");
  value.col && (textarea.cols = Number(value.col));
  value.row && (textarea.rows = Number(value.row));
  value.placeHolder && (textarea.placeholder = value.placeHolder);
  textareaMainDiv.append(textarea);
  return textareaMainDiv;
};

const formCreation = (
  values: values,
  MainformDiv: any,
  count: number,
  key: string
) => {
  const formDiv = document.createElement("div");
  formDiv.classList.add("inte-inputs");
  if (values.type == "string") {
    const inputString = createInput(values, count, key);
    formDiv?.append(inputString);
    MainformDiv?.append(formDiv);
  } else if (values.type == "selection") {
    const select = selectionBuilder(values, key);
    formDiv.append(select);
    MainformDiv.append(formDiv);
  } else if (values.type == "radio") {
    const options = Object(values.options);
    const labelText = values.title;
    createRadio(MainformDiv, options, key, labelText);
  } else if (values.type == "textarea") {
    const textarea = textareaBuilder(values, key);
    MainformDiv.append(textarea);
  }
};

const form = document.createElement("form") as HTMLFormElement;
form.id = "myForm";
form.classList.add("form-list");

const MainformDiv = document.createElement("div") as HTMLDivElement;
MainformDiv.classList.add("inte-form-div");
const dataObj = {} as any;

const generateChildJson = (json: any) => {
  let childObj = {} as any;
  if (json.type != "string") {
    for (const [key, value] of Object.entries(json)) {
      let data = value as any;
      if (data[key] != "string" || data[key] != "selection") {
        if (data["type"] == "string" || data["type"] == "selection") {
          childObj[key] = "";
        } else if (data.type == "object") {
          let val = generateChildJson(data);
          childObj[key] = val;
        }
      } else {
        childObj[key] = "";
      }
    }
    return childObj;
  }
};

const generateEmptyJson = (json: any) => {
  for (const [key, value] of Object.entries(json)) {
    if (key != "keyType") {
      let data = value as any;
      if (data["type"] != "string") {
        dataObj[key] = typeof value === "object" ? {} : "";
        if (dataObj[key]) {
          let obj = value as any;
          for (const [childKey, value] of Object.entries(obj)) {
            let dataVal = value as any;
            if (dataVal != "object") {
              dataObj[key][childKey] = generateChildJson(value);
            }
          }
        }
      } else {
        if (key != "type") dataObj[key] = "";
      }
    } else {
      dataObj["keyType"] = value;
    }
  }
};

function addDynamicForms(jsonObject: any, isChild?: boolean, remove?: boolean) {
  if (count == 0) {
    MainformDiv.innerHTML = "";
  }
  const schemaForm = document.querySelector(
    ".inte-schema-form"
  ) as HTMLDivElement;
  const checkIfDivExist = document.querySelector(
    ".form-list"
  ) as HTMLDivElement;

  if (checkIfDivExist && remove) {
    checkIfDivExist.remove();
    dataArray = [];
  }

  for (const [key, value] of Object.entries(jsonObject)) {
    const values = value as values;
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
  const jsonSchema = document.querySelector(
    "#inte-input-schema"
  ) as HTMLInputElement;
  const schema = jsonSchema.value;
  const getSchemaData = await fetch(schema);
  const json = await getSchemaData.json();
  const jsonSchemaObj = schema !== "" ? json : jsonScheme.default;
  if (jsonSchemaObj) {
    generateEmptyJson(jsonSchemaObj);
    addDynamicForms(jsonSchemaObj, false, true);
  }
}

const copyToClipboardButton = document.querySelector(
  ".inte-copy-text"
) as HTMLDivElement;

function eachRecursive(obj: any) {
  for (var k in obj) {
    const form = new FormData(
      document.getElementById("myForm") as HTMLFormElement
    );
    for (const [key, val] of form) {
      if (key === k) obj[key] = val;
    }
    if (typeof obj[k] == "object" && obj[k] !== null) {
      eachRecursive(obj[k]);
    } else {
      for (const [key, val] of form) {
        if (key === k) obj[key] = val;
      }
    }
  }
}

function copyToClipboard() {
  eachRecursive(dataObj);
  navigator.clipboard.writeText(JSON.stringify(dataObj));
}

copyToClipboardButton.addEventListener("click", copyToClipboard);

const generateFormButton = document.querySelector(
  ".inte-generate-btn"
) as HTMLButtonElement;

generateFormButton.addEventListener("click", formBuilder);

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
const initBtn = document.querySelector(".inte-init-btn") as HTMLButtonElement;

function isEmpty(obj: any) {
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
  const iWindow = (iframe?.contentWindow as CustomWindow) || null;
  if (iWindow) {
    Initialize = true;

    // Trigger init event inside the iframe
    eachRecursive(dataObj);
    if (!isEmpty(dataObj)) {
      iWindow.postMessage(
        {
          dataObj,
        },
        "*"
      );
    } else {
      iWindow.postMessage(
        {
          data,
        },
        "*"
      );
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
const changeIframe = (e: any) => {
  e.preventDefault();

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

  eventLoggerDiv.append(p);
};

(window.parent as any).eventLogger = eventLogger;

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
  if (
    Object.keys(XrTypes).includes(typeValue) &&
    emittedEvents.includes(typeValue)
  ) {
    iframe?.contentWindow?.postMessage(
      {
        event: typeValue,
        data: parsedValue,
      },
      "*"
    );
    eventLogger(data);
  }
};

generateBtn.onclick = generateEvent;

// Emits event from iframe to playground and pass the XREvent object
const emitEvent = (XREvent: XREvent) => {
  if (Object.keys(XrTypes).includes(XREvent.event) && Initialize == true) {
    listenToEvent(XREvent);
  }
};

//Listen To event from iframe to playground events.

const listenToEvent = (XREvent: XREvent) => {
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
