import pluginData from "./config.json" assert { type: "json" };

const config = pluginData.config;

const theming = pluginData.theming;

//postMessage listener to listen init event and alert generated events.
window.addEventListener("message", function (message) {
  const data = message?.data?.data || message?.data?.dataObj;
  if (data?.type === "init" || data?.keyType === "init") {
    const addToCart = document.querySelector(".add-to-cart");
    addToCart.innerHTML = data?.config?.button ?? config.button;
    addToCart.style.background =
      data?.theming?.primaryColor ?? theming.primaryColor;
    listenToEvent("xr_added_to_cart", (e) => {
      alert(
        "The listener of the plugin is triggered with data: " +
          JSON.stringify(e)
      );
    });
  }
});

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
  };
  emitEvent(data);
}

const triggerBtn = document.querySelector(".add-to-cart");

// Click event listener for trigger button inside iframe
triggerBtn?.addEventListener("click", clicked);
