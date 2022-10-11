import pluginData from "./config.json" assert { type: "json" };

const config = pluginData.config;

const theming = pluginData.theming;

//postMessage listener to listen init event and alert generated events.
window.addEventListener("message", function (message) {
  const data = message.data.data;
  if (data.type === "init") {
    const addToCart = document.querySelector(".add-to-cart");
    addToCart.innerHTML = config.button;
    addToCart.style.background = theming.primaryColor;
  }
});

function showData() {
  alert("Callback function successfully triggered");
}

// This function will be called on trigger event click
function clicked() {
  const data = {
    event: "xr_add_to_cart",
    customEventName: "custom_event_1",
    data: {
      products: {
        name: "product 1",
      },
    },
    callBack: showData,
  };

  // Emitting xr_add_to_cart with data
  emitEvent(data);
}

const triggerBtn = document.querySelector(".add-to-cart");

// Click event listener for trigger button inside iframe
triggerBtn?.addEventListener("click", clicked);
