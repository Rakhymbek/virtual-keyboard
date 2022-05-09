let taskTitle = document.createElement("h1");
taskTitle.classList.add("task__title");
taskTitle.innerHTML = "RSS Virtual Keyboard";
document.body.append(taskTitle);

let clue = document.createElement("p");
clue.classList.add("clue");
clue.innerHTML = `The virtual keyboard is able to switch between two language layouts (<b>ControlLeft</b> + <b>AltLeft</b>)`;
document.body.append(clue);

let textArea = document.createElement("textarea");
textArea.classList.add("board");
document.body.append(textArea);



const activeBtns = ["Backspace", "Caps", "Enter", "Space", "Del", "Ctrl", "ShiftL", "ShiftR", "Tab", "win","AltL", "AltR", "EN", "RU"];
let lang = localStorage.getItem('lang') || 'en';
console.log(lang);
let keyLayoutRu = [
    "ё","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "Tab","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "Del",
    "Caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
    "ShiftL", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "▲", "ShiftR",
    "Ctrl", "RU", "AltL", "Space", "AltR", "◀", "▼", "▶", "Ctrl"
];

let keyLayout = [
    "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "Tab","q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "Del",
    "Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
    "ShiftL", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "▲", "ShiftR",
    "Ctrl", "EN", "AltL", "Space", "AltR", "◀", "▼", "▶", "Ctrl"
];

let shiftEng = [
    "~","!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "Backspace",
    "Tab","Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|", "Del",
    "Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", '"', "Enter",
    "ShiftL", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "▲", "ShiftR",
    "Ctrl", "EN", "AltL", "Space", "AltR", "◀", "▼", "▶", "Ctrl"
];

let shiftRu = [
    "Ё","!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "Backspace",
    "Tab","Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "/", "Del",
    "Caps", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", 'Э', "Enter",
    "ShiftL", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",", "▲", "ShiftR",
    "Ctrl", "RU", "AltL", "Space", "AltR", "◀", "▼", "▶", "Ctrl"
];

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
    start: 0,
    end: 0,
    capsLock: false,
    shift: false,
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
        elem.addEventListener("focus", () => {
            this.open(elem.value, currentVal => {
                elem.value = currentVal;
                elem.focus();
            });
        });
        elem.addEventListener("mousedown", () => {
            this.properties.start = textArea.selectionStart;
            this.properties.end = textArea.selectionEnd;
        });
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayoutLang;
    if(lang === "RU") {
        keyLayoutLang = keyLayoutRu;
    }else {
        keyLayoutLang = keyLayout;
    }

    keyLayoutLang.forEach(key => {
        const keyElement = document.createElement("button");
        const insertLineBreak = ["Backspace", "Del", "Enter", "ShiftR"].indexOf(key) !== -1;
        keyElement.setAttribute("type", "button");
        keyElement.classList.add("keyboard__key");

        switch(key) {
            case "Backspace":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.textContent = key;

                keyElement.addEventListener("click", () => {
                    this.properties.start = textArea.selectionStart; 
                    this.properties.end = textArea.selectionEnd;
                    this.properties.value = textArea.value.substring(0, this.properties.start - 1) + textArea.value.substring(this.properties.end);
                    this.triggerEvent("oninput");
                    this.properties.start--;
                    this.properties.end--;
                    textArea.focus();
                    textArea.setSelectionRange(this.properties.start, this.properties.end);
                });
                break;
            case "Caps":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--active--off", "keyboard__key--dark");
                keyElement.textContent = "Caps";

                keyElement.addEventListener("click", () => {
                    this.toggleCaplsLock();
                    keyElement.classList.toggle("keyboard__key--active--on", this.properties.capsLock);
                });
                break;
            case "Enter":
                keyElement.classList.add("keyboard__key--wide", "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.textContent = key;

                keyElement.addEventListener("click", () => {
                    this.setPostionAndUpdateValue("\n");
                });
                break;
            case "Space":
                keyElement.classList.add("keyboard__key--space", "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.textContent = key;

                keyElement.addEventListener("click", (e) => {
                    this.setPostionAndUpdateValue(" ");
                });
                break;
            case "Del":
                keyElement.classList.add( "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.textContent = key;
                keyElement.addEventListener("click", () => {
                    this.properties.start = textArea.selectionStart; 
                    this.properties.end = textArea.selectionEnd;
                    console.log(textArea.value.substring(0, this.properties.start), textArea.value.substring(textArea.value.length , this.properties.end +1));
                    let val = textArea.value.substring(0, this.properties.start) + textArea.value.substring(this.properties.end + 1);
                    
                    this.properties.value = val;
                    this.triggerEvent("oninput");
                    
                    textArea.focus();
                    textArea.setSelectionRange(this.properties.start, this.properties.end);
                });
                break;
            case "Ctrl":
                keyElement.classList.add( "keyboard__key--flexed", "keyboard__key--dark");
                keyElement.textContent = key;
                break;
            case "ShiftL":
                keyElement.classList.add( "keyboard__key--flexed", "keyboard__key--dark", "keyboard__key--active--off");
                keyElement.textContent = key;

                keyElement.addEventListener("mousedown", () => {
                    this.properties.shift = !this.properties.shift;
                    this.toggleShift();
                    keyElement.classList.toggle("keyboard__key--active--on", this.properties.shift);
                });
                break;
            case "ShiftR":
                keyElement.classList.add( "keyboard__key--shiftr", "keyboard__key--dark", "keyboard__key--active--off");
                keyElement.textContent = key;

                keyElement.addEventListener("mousedown", () => {
                    this.properties.shift = !this.properties.shift;
                    this.toggleShift();
                    keyElement.classList.toggle("keyboard__key--active--on", this.properties.shift);
                });
                break;
            case "AltL":
                keyElement.textContent = key;
                break;
            case "AltR":
                keyElement.textContent = key;
                break;
            case "EN":
                keyElement.classList.add("lang");
                keyElement.textContent = key;
                keyElement.addEventListener("click", () => {
                    this.changeLang(keyElement);
                    console.log(keyElement);
                });
                break;
            case "RU":
                keyElement.classList.add("lang");
                keyElement.textContent = key;
                keyElement.addEventListener("click", () => {
                    this.changeLang(keyElement);
                    console.log(keyElement);
                });
                break;
            case "Tab":
                keyElement.classList.add("keyboard__key--dark");
                keyElement.textContent = key;

                keyElement.addEventListener("click", () => {
                    this.setPostionAndUpdateValue("\t");
                });
                break;
            default:
                keyElement.textContent = key.toLowerCase();
                
                keyElement.addEventListener("click", () => {
                    this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                    this.setPostionAndUpdateValue(keyElement.textContent);
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

  setPostionAndUpdateValue(value) {
    this.properties.start = textArea.selectionStart; 
    this.properties.end = textArea.selectionEnd;
    let text = textArea.value.substring(0, this.properties.start) + value + textArea.value.substring(this.properties.end);
    textArea.value = text;
    this.properties.start = this.properties.end = this.properties.start + 1;
    textArea.focus();
    textArea.setSelectionRange(this.properties.start, this.properties.end);
  },

  toggleCaplsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for(const key of this.elements.keys) {
        if(!key.classList.contains("keyboard__key--dark") && !activeBtns.includes(key.textContent)) {
            key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
    }
  },

  toggleShift() {
    let keys = document.querySelectorAll('.keyboard__key');
    let lang = document.querySelector('.lang');
    let shiftLang;
    let keyLayoutLang;
    if(lang.textContent === "RU") {
        shiftLang = shiftRu;
        keyLayoutLang = keyLayoutRu;
    }else {
        shiftLang = shiftEng;
        keyLayoutLang = keyLayout;
    }
    for(let i = 0; i < this.elements.keys.length; i++) {
        keys[i].textContent = this.properties.shift ? shiftLang[i] : keyLayoutLang[i];
    }
  },

  changeLang(keyElement) {
    let keys = document.querySelectorAll('.keyboard__key');
    
    if(keyElement.textContent === 'EN') {
        for(let i = 0; i < this.elements.keys.length; i++) {
            keys[i].textContent = keyLayoutRu[i];
            lang = "RU";
        }
    }else {
        for(let i = 0; i < this.elements.keys.length; i++) {
            keys[i].textContent = keyLayout[i];
            lang = "EN";
        }
    }
    localStorage.setItem('lang', lang);
  },

  open(initialVal, oninput) {
      this.properties.value = initialVal || "";
      this.eventHandlers.oninput = oninput;
  },
};

window.addEventListener("DOMContentLoaded", () => {
  Keyboard.init();
});

const keyboardCodes = [
  "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace", 
  "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "Delete",
  "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter", 
  "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight", 
  "ControlLeft","EN", "AltLeft", "Space", "AltRight", "ArrowLeft", "ArrowDown", "ArrowRight", "ControlRight"
];

let check = true;


document.body.addEventListener('keydown', (event) => {
    textArea.focus();
    let keys = document.querySelectorAll('.keyboard__key');
    let lang = document.querySelector('.lang');
    keyboardCodes.forEach((key, i) => {
      if (event.code === keyboardCodes[i]) {
        if(event.repeat !== undefined) {
            check = !event.repeat ;
        }
        if(!check) return;
        keys[i].style.background = "rgba(255, 255, 255, 0.1)";
        if (event.code === "CapsLock") {
          keys[i].classList.toggle("keyboard__key--active--on");
          Keyboard.toggleCaplsLock();
        }
        if (event.code === "ShiftLeft") {
          keys[i].classList.toggle("keyboard__key--active--on");
        }
        if (event.code === "AltLeft" || event.code === "AltRight") {
            event.preventDefault();
        }
        if(event.altKey && event.ctrlKey && event.code !== "AltRight") {
            Keyboard.changeLang(lang);
        }
        if(event.shiftKey) {
            Keyboard.properties.shift = true;
            Keyboard.toggleShift();
        }
        if(event.code === "ShiftRight") {
            Keyboard.properties.shift = true;
            Keyboard.toggleShift();
            keys[i].classList.toggle("keyboard__key--active--on");
        }
      }
    })
});

document.body.addEventListener('keyup', (event) => {
    let keys = document.querySelectorAll('.keyboard__key');
    keyboardCodes.forEach((key, i) => {
        if (event.code === keyboardCodes[i]) {
            
            keys[i].style.background = "rgba(255, 255, 255, 0.2)";
            if (event.code === "CapsLock") {
                keys[i].style.background = '';
              }
            if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
            keys[i].style.background = '';
            }
            if (event.code === "Enter" || event.code === "Tab" || event.code === "Delete" || 
                event.code === "Backspace" || event.code === "Space" || event.code === "ControlRight" || event.code === "ControlLeft") {
                keys[i].style.background = '';
            }
            if (event.code === "AltLeft" || event.code === "AltRight") {
            keys[i].style.background = '';
            }
            if(event.code === "ShiftLeft") {
                check = true;
                Keyboard.properties.shift = false;
                Keyboard.toggleShift();
                keys[i].classList.remove("keyboard__key--active--on");
            }
            if(event.code === "ShiftRight") {
                check = true;
                Keyboard.properties.shift = false;
                Keyboard.toggleShift();
                keys[i].classList.remove("keyboard__key--active--on");
            }
        }
    })
});