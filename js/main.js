const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    this.elements.main.classList.add("keyboard");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.append(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    this.elements.main.append(this.elements.keysContainer);
    document.body.append(this.elements.main);

    document.querySelectorAll(".board").forEach(elem => {
        console.log(elem);
        elem.addEventListener("focus", () => {
            this.open(elem.value, currentVal => {
                elem.value = currentVal;
            });
        });
    });
  },

  createKeys() {
      const fragment = document.createDocumentFragment();
      const keyLayout = [
        "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
        "Tab","q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "Del",
        "Caps Lock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
        "ShiftL", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "▲", "ShiftR",
        "Ctrl", "Win", "Alt", "Space", "Alt", "◀", "▼", "▶", "Ctrl"
      ];

      keyLayout.forEach(key => {
        const keyElement = document.createElement("button");
        const insertLineBreak = ["Backspace", "Del", "Enter", "ShiftR"].indexOf(key) !== -1;

        keyElement.setAttribute("type", "button");
        keyElement.classList.add("keyboard__key");

        switch(key) {
            case "Backspace":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.innerHTML = "Backspace";

                keyElement.addEventListener("click", () => {
                    this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                    this.triggerEvent("oninput");
                });
                break;
            case "Caps Lock":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--active--off", "keyboard__key--dark");
                keyElement.innerHTML = "Caps";

                keyElement.addEventListener("click", () => {
                    this.toggleCaplsLock();
                    keyElement.classList.toggle("keyboard__key--active--on", this.properties.capsLock);
                });
                break;
            case "Enter":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.innerHTML = "Enter";

                keyElement.addEventListener("click", () => {
                    this.properties.value +="\n";
                    this.triggerEvent("oninput");
                });
                break;
            case "Space":
                keyElement.classList.add("keyboard__key--space", "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.innerHTML = "Space";

                keyElement.addEventListener("click", () => {
                    this.properties.value +=" ";
                    this.triggerEvent("oninput");
                });
                break;
            case "Del":
                keyElement.classList.add( "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.innerHTML = "Del";
                break;
            case "Ctrl":
                keyElement.classList.add( "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.innerHTML = "Ctrl";
                break;
            case "ShiftL":
                keyElement.classList.add( "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.innerHTML = "ShiftL";
                break;
            case "ShiftR":
                keyElement.classList.add( "keyboard__key--shiftr", "keyboard__key--dark");
                keyElement.innerHTML = "ShiftR";
                break;
            default:
                keyElement.textContent = key.toLowerCase();

                keyElement.addEventListener("click", () => {
                    this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                    this.triggerEvent("oninput");
                });
                break;
        }

        fragment.append(keyElement);

        if(insertLineBreak) {
            fragment.append(document.createElement("br"));
        }
      });

      return fragment;
  },

  triggerEvent(handlerName) {
    if(typeof this.eventHandlers[handlerName] == "function") {
        this.eventHandlers[handlerName](this.properties.value);
    }
  },

  toggleCaplsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    const activeBtns = ["Backspace", "Caps Lock", "Enter", "Space", "Del", "Ctrl", "ShiftL", "ShiftR", "tab", "win","alt"];

    for(const key of this.elements.keys) {
        if(!key.classList.contains("keyboard__key--dark") && !activeBtns.includes(key.textContent)) {
            key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
    }
  },

  open(initialVal, oninput) {
      this.properties.value = initialVal || "";
      this.eventHandlers.oninput = oninput;
  },
};

window.addEventListener("DOMContentLoaded", () => {
  Keyboard.init();
    Keyboard.open("", (currentVal) => {
        console.log(currentVal);
    });

});


