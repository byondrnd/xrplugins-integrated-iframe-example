//postMessage listener to listen init event.

window.addEventListener("message", function (message) {
  const data = message?.data?.data || message?.data?.dataObj;
  // code for init exmaple
  if (data?.type === "init" || data?.keyType === "init") {
    const addToCart = document.querySelector(".add-to-cart");
    addToCart.innerHTML = data?.config?.button;
    addToCart.style.background = data?.theming?.primaryColor;
    listenToEvent();
  }
});

// This callBack is called when event is listen by listenToEvent method

const callBack = (data) => {
  alert("callBack called plugin");
};

// listen all the emitted events from playground

const listenToEvent = () => {
  window.addEventListener("message", function (message) {
    callBack(message.data);
  });
};

const emitEvent = (XREvent) => {
  parent.postMessage(XREvent, "*");
};
// This function will be called on trigger event click
function clicked() {
  const data = {
    event: "xr_added_to_cart",
    customEventName: "custom_event_1",
    data: {
      products: {
        name: "product 1",
      },
    },
    eventType: "emit",
  };
  emitEvent(data);
}

const triggerBtn = document.querySelector(".add-to-cart");

// Click event listener for trigger button inside iframe
triggerBtn?.addEventListener("click", clicked);
