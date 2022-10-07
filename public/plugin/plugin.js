import pluginData from "./config.json" assert { type: "json" };

const config = pluginData.config;

const theming = pluginData.theming;

window.addEventListener("message", function (message) {
  const data = message.data.data;
  if (data.type === "init") {
    const addToCart = document.querySelector(".add-to-cart");
    addToCart.innerHTML = config.button;
    addToCart.style.background = theming.primaryColor;
  } else {
    alert(data.event);
  }
});

function showData() {
  alert("Callback function successfully triggered");
}
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

  emitEvent(data);
}

const triggerBtn = document.querySelector(".add-to-cart");
triggerBtn?.addEventListener("click", clicked);
