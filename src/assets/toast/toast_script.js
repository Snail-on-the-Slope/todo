var Toast = function(element, config) {
    // приватные переменные класса Toast
    var _this = this,
        _element = element,
        _config = {
            autohide: true,
            delay: 200,
        };
    // установление _config
    for (var prop in config) {
        _config[prop] = config[prop];
    }
    // get-свойство element
    Object.defineProperty(this, "element", {
        get: function() {
            return _element;
        },
    });
    // get-свойство config
    Object.defineProperty(this, "config", {
        get: function() {
            return _config;
        },
    });
    // обработки события click (скрытие сообщения при нажатии на кнопку "Закрыть")
    _element.addEventListener("click", function(e) {
        if (e.target.classList.contains("toast__close")) {
            _this.hide();
        }
    });
};
// методы show и hide, описанные в прототипе объекта Toast
Toast.prototype = {
    show: function() {
        var _this = this;
        if (this.config.autohide) {
            setTimeout(function() {
                _this.hide();
            }, this.config.delay);
        }
    },
    hide: function() {
        this.element.remove();
    },
};

// статическая функция для Toast (используется для создания сообщения)
Toast.create = function(text, color) {
    var fragment = document.createDocumentFragment(),
        toast = document.createElement("div"),
        toastClose = document.createElement("button");
    toast.classList.add("toast");
    toast.style.backgroundColor = "#" + color;
    toast.style.display = "block";
    toast.textContent = text;
    toastClose.classList.add("toast__close");
    toastClose.setAttribute("type", "button");
    toastClose.textContent = "×";
    toastClose.addEventListener("click", function() {
        let el = document.querySelector(".toast");
        el.remove();
    });
    toast.appendChild(toastClose);
    fragment.appendChild(toast);
    return fragment;
};
// статическая функция для Toast (используется для добавления сообщения на страницу)
Toast.add = function(text, color) {
    var config = {
        text,
        color,
        autohide: true,
        delay: 45000,
    };
    document
        .querySelector(".toasts")
        .appendChild(Toast.create(config.text, config.color));
    var toasts = document.querySelectorAll(".toast");
    var toast = new Toast(toasts[toasts.length - 1], {
        autohide: config.autohide,
        delay: config.delay,
    });
    toast.show();
    return toast;
};

export default Toast;