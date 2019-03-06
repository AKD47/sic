function Validation() {

    this.init = function (options) {
        this.defaultParams = {
            classItem: "valItem",
            attributeErrorMessage: "data-msg",
            attributeErrorClassMessage: "data-error-class-msg",
            attributeErrorClassInput: "data-error-class-input",
            attributeErrorBox: "data-box",
            attributePromptMessage: 'data-prompt',
            attributePromptClassMessage: 'data-prompt-class-msg',
            attributePromptBox: 'data-prompt-box',
            attributeSuccessMessage: 'data-success',
            attributeSuccessClassMessage: 'data-success-class-msg',
            attributeSuccessClassInput: 'data-success-class-input',
            attributeSuccessBox: 'data-success-box',
            event: 'submit',
            eventElement: '#submit',
            errorClass: 'inputError',
            successClass: 'inputSuccess',
            errorMessageClass: 'errorMsgClass',
            successMessageClass: 'successMsgClass',
            promptMessageClass: 'promptClass',
            ajaxUrl: 'ajax.php',
            ajax: false,
            submitForm: true,
            tpl: [],
            tpl_msg: [],
            errorMsgTpl: false,
            promptMsgTpl: false,
            successMsgTpl: false,
            items: [],
            ajaxSubmitSuccess: function (responseText, err, form) {
                if (!err) {
                    form.submit();
                }
            },
            submitSuccess: function (err, form) {
                if (!err) {
                    form.submit();
                }
            },
            submitError: function (err, form) {
            },
            ajaxOnblurSuccess: function (responseText, err, form) {
            },
        };

        this.finalParams = this.defaultParams;

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (options[key] !== undefined) {
                    this.finalParams[key] = options[key];
                }
            }
        }
        this.options = this.finalParams;

        var valElements = this.getValInput();
        for (var i = 0; i < valElements.length; i++) {
            valElements[i].onfocus = this.customPrompt.bind(this);
        }

        if (this.options.event == 'submit') {
            var submitElement = this.getSubmitElement();
            submitElement.onclick = this.customSubmit.bind(this);
            for (var k = 0; k < valElements.length; k++) {
                valElements[k].onblur = this.clearPrompt.bind(this);
            }
        } else if (this.options.event == 'onblur') {
            for (var j = 0; j < valElements.length; j++) {
                valElements[j].onblur = this.customValidationOnblur.bind(this);
            }
        }
    }

    this.customSubmit = function (event) {
        event.preventDefault();
        var validationElements = document.getElementsByClassName(this.options.classItem);
        var form = this.getParent(this.getSubmitElement(), 'FORM');
        var flag = [];
        this.clearMsgBox();
        for (var i = 0; i < validationElements.length; i++) {
            var next = validationElements[i].nextElementSibling;
            if (next != null) {
                if (next.classList.contains(this.options.errorMessageClass)) {
                    next.parentNode.removeChild(next);
                }
            }
            if (validationElements[i].hasAttribute('data-tpl') || this.hasTpl(validationElements[i])) {
                var arr = this.getTpl(validationElements[i]);
                var pat = this.tpls();
                var msgs = this.tpls_msg();
                var val = validationElements[i].value;
                if (!pat[arr.trim()].test(val)) {
                    this.deleteErrorMsg(validationElements[i]);
                    this.generateMsg(validationElements[i], 'error', this.getTplMsg(validationElements[i]));
                    flag.push(false);
                }
                else {
                    this.deleteErrorMsg(validationElements[i]);
                    this.generateMsg(validationElements[i], 'success');
                    flag.push(true);
                }
            }
            else {
                if (!validationElements[i].checkValidity()) {
                    this.deleteErrorMsg(validationElements[i]);
                    this.generateMsg(validationElements[i], 'error');
                    flag.push(false);
                }
                else {
                    this.deleteErrorMsg(validationElements[i]);
                    this.generateMsg(validationElements[i], 'success');
                    flag.push(true);
                }
            }
        }
        if (this.findFalse(flag) !== false) {
            if (this.options.ajax) {
                this.ajaxValidPost(validationElements, this.options.ajaxSubmitSuccess);
            }
            else {
                if (this.options.submitForm) {
                    this.options.submitSuccess(false, form);
                }
            }
        }
        else {
            this.options.submitError(true, form);
        }
    }

    this.customValidationOnblur = function (event) {
        var validationElement = event.target;
        var next = validationElement.nextSibling;
        if (next != null) {
            if (next.classList.contains(this.options.errorMessageClass)) {
                next.parentNode.removeChild(next);
            }
        }
        if (validationElement.hasAttribute('data-tpl') || this.hasTpl(validationElement)) {
            var arr = this.getTpl(validationElement);
            var pat = this.tpls();
            var val = validationElement.value;
            if (!pat[arr.trim()].test(val)) {
                this.deleteErrorMsg(validationElement);
                this.generateMsg(validationElement, 'error',this.getTplMsg(validationElement));
            }
            else {
                if (this.options.ajax) {
                    this.ajaxValidPost(validationElement, this.options.ajaxOnblurSuccess);
                }
                else {
                    this.deleteErrorMsg(validationElement);
                    this.generateMsg(validationElement, 'success');
                }
            }
        }
        else {
            if (!validationElement.checkValidity()) {
                this.deleteErrorMsg(validationElement);
                this.generateMsg(validationElement, 'error');
            }
            else {
                if (this.options.ajax) {
                    this.ajaxValidPost(validationElement, this.options.ajaxOnblurSuccess);
                }
                else {
                    this.deleteErrorMsg(validationElement);
                    this.generateMsg(validationElement, 'success');
                }
            }
        }
    }

    this.customPrompt = function (event) {
        var validationElement = event.target;
        if (this.hasMsg(validationElement, 'prompt')) {
            this.deleteErrorMsg(validationElement);
            this.generateMsg(validationElement, 'prompt');
        }
    }

    this.clearPrompt = function (event) {
        var validationElement = event.target;
        this.deleteErrorMsg(validationElement);
        if (validationElement.hasAttribute(this.options.attributePromptBox)) {
            var el = this.getElement(validationElement.getAttribute(this.options.attributePromptBox));
            el.innerHTML = '';
        }
    }

    this.clearMsgBox = function () {
        var valElements = this.getValInput();
        for (var i = 0; i < valElements.length; i++) {
            var el;
            if (valElements[i].hasAttribute(this.options.attributeErrorBox)) {
                el = this.getElement(valElements[i].getAttribute(this.options.attributeErrorBox));
                el.innerHTML = '';
            }
            if (valElements[i].hasAttribute(this.options.attributePromptBox)) {
                el = this.getElement(valElements[i].getAttribute(this.options.attributePromptBox));
                el.innerHTML = '';
            }
            if (valElements[i].hasAttribute(this.options.attributeSuccessBox)) {
                el = this.getElement(valElements[i].getAttribute(this.options.attributeSuccessBox));
                el.innerHTML = '';
            }
        }
    }

    this.getParent = function (obj, parentTagName) {
        return (obj.tagName == parentTagName) ? obj : this.getParent(obj.parentNode, parentTagName);
    }

    this.generateErrorMsg = function (vEl) {
        var eci = this.getInputErrorClass(vEl);
        var ecm = this.getMsgErrorClass(vEl);
        vEl.classList.add(eci);
        if (vEl.hasAttribute(this.options.attributeErrorMessage)) {
            var errorMsg = document.createElement('span');
            errorMsg.classList.add(ecm);
            errorMsg.innerHTML = vEl.getAttribute(this.options.attributeErrorMessage);
            if (vEl.hasAttribute(this.options.attributeErrorBox)) {
                var box = this.getElement(vEl.getAttribute(this.options.attributeErrorBox));
                errorMsg.classList.add('error-to-' + vEl.getAttribute('name'));
                box.appendChild(errorMsg);
            }
            else {
                this.insertAfter(errorMsg, vEl);
            }
        }
    }

    this.generateMsg = function (vEl, type, msg) {
        msg = msg || '';
        var inputClass, msgClass, boxAttr;
        if (type == 'error') {
            inputClass = this.getInputErrorClass(vEl);
            msgClass = this.getMsgErrorClass(vEl);
            vEl.classList.add(inputClass);
            boxAttr = this.options.attributeErrorBox;
        }
        if (type == 'prompt') {
            msgClass = this.getMsgPromptClass(vEl);
            boxAttr = this.options.attributePromptBox;
        }
        if (type == 'success') {
            inputClass = this.getInputSuccessClass(vEl);
            msgClass = this.getMsgSuccessClass(vEl);
            vEl.classList.add(inputClass);
            boxAttr = this.options.attributeSuccessBox;
        }

        if (this.hasMsg(vEl, type) || msg != '') {
            var tpl, thisMsg = msg != '' ? msg : this.getMsg(vEl, type);
            if(tpl = this.generateTplMsg(vEl,type,thisMsg)){
                thisMsg = tpl;
            }
            var errorMsg = document.createElement('span');
            errorMsg.classList.add(msgClass);
            errorMsg.innerHTML = thisMsg;
            if (vEl.hasAttribute(boxAttr)) {
                var box = this.getElement(vEl.getAttribute(boxAttr));
                errorMsg.classList.add(type + '-to-' + vEl.getAttribute('name'));
                box.appendChild(errorMsg);
            }
            else {
                this.insertAfter(errorMsg, vEl);
            }
        }
    }

    this.generateAjaxErrorMsg = function (vEl, msg) {
        vEl.classList.add(this.options.errorClass);
        var errorMsg = document.createElement('span');
        errorMsg.classList.add(this.options.errorMessageClass);
        errorMsg.innerHTML = msg;
        this.insertAfter(errorMsg, vEl);
    }

    this.generateTplMsg = function(vEl,type,msg){
        if(type == 'error'){
            if (this.options.errorMsgTpl){
                return this.options.errorMsgTpl.replace('{msg}',msg);
            }
        }
        if(type == 'prompt'){
            if (this.options.promptMsgTpl){
                return this.options.promptMsgTpl.replace('{msg}',msg);
            }
        }
        if(type == 'success'){
            if (this.options.successMsgTpl){
                return this.options.successMsgTpl.replace('{msg}',msg);
            }
        }
        return false;
    }

    this.getInputErrorClass = function (vEl) {
        var item = this.getScriptItem(vEl);
        if (typeof item.errorClass != 'undefined') {
            return item.errorClass;
        }
        else if (vEl.hasAttribute(this.options.attributeErrorClassInput)) {
            return vEl.getAttribute(this.options.attributeErrorClassInput);
        }
        else {
            return this.options.errorClass;
        }
    }

    this.getMsgErrorClass = function (vEl) {
        var item = this.getScriptItem(vEl);
        if (typeof item.errorMsgClass != 'undefined') {
            return item.errorMsgClass;
        }
        if ((vEl.hasAttribute(this.options.attributeErrorClassMessage))) {
            return vEl.getAttribute(this.options.attributeErrorClassMessage);
        }
        else {
            return this.options.errorMessageClass;
        }
    }

    this.getMsgPromptClass = function (vEl) {
        var item = this.getScriptItem(vEl);
        if (typeof item.promptMsgClass != 'undefined') {
            return item.promptMsgClass;
        }
        if ((vEl.hasAttribute(this.options.attributePromptClassMessage))) {
            return vEl.getAttribute(this.options.attributePromptClassMessage);
        }
        else {
            return this.options.promptMessageClass;
        }
    }

    this.getMsgSuccessClass = function (vEl) {
        var item = this.getScriptItem(vEl);
        if (typeof item.successMsgClass != 'undefined') {
            return item.successMsgClass;
        }
        if ((vEl.hasAttribute(this.options.attributeSuccessClassMessage))) {
            return vEl.getAttribute(this.options.attributeSuccessClassMessage);
        }
        else {
            return this.options.successMessageClass;
        }
    }

    this.getInputSuccessClass = function (vEl) {
        var item = this.getScriptItem(vEl);
        if (typeof item.successClass != 'undefined') {
            return item.successClass;
        }
        else if (vEl.hasAttribute(this.options.attributeSuccessClassInput)) {
            return vEl.getAttribute(this.options.attributeSuccessClassInput);
        }
        else {
            return this.options.successClass;
        }
    }

    this.getMsg = function (vEl, type) {
        if (this.hasScriptMsg(vEl, type)) {
            return this.getScriptMsg(vEl, type);
        }
        if (type == 'error') {
            return vEl.getAttribute(this.options.attributeErrorMessage);
        }
        if (type == 'prompt') {
            return vEl.getAttribute(this.options.attributePromptMessage);
        }
        if (type == 'success') {
            return vEl.getAttribute(this.options.attributeSuccessMessage);
        }
    }

    this.hasMsg = function (vEl, type) {
        var attr;
        if (this.hasScriptMsg(vEl, type)) {
            return true;
        }
        if (type == 'error') {
            attr = this.options.attributeErrorMessage;
        }
        if (type == 'prompt') {
            attr = this.options.attributePromptMessage;
        }
        if (type == 'success') {
            attr = this.options.attributeSuccessMessage;
        }

        return vEl.hasAttribute(attr);
    }

    this.getScriptMsg = function (vEl, type) {
        //var item = vEl.getAttribute('name');
        var item = this.getScriptItem(vEl);
        if (this.hasScriptMsg(vEl, 'error') && type == 'error') {
            return item.errorMsg;
        }
        if (this.hasScriptMsg(vEl, 'prompt') && type == 'prompt') {
            return item.promptMsg;
        }
        if (this.hasScriptMsg(vEl, 'success') && type == 'success') {
            return item.successMsg;
        }
    }

    this.hasScriptMsg = function (vEl, type) {
        var item = vEl.getAttribute('name');
        if (item) {
            item = this.getScriptItem(item);
            if (type == 'error') {
                return typeof item.errorMsg != 'undefined';
            }
            if (type == 'prompt') {
                return typeof item.promptMsg != 'undefined';
            }
            if (type == 'success') {
                return typeof item.successMsg != 'undefined';
            }
        }
    }

    this.hasTpl = function (vEl) {
        var item = vEl.getAttribute('name');
        if (item) {
            item = this.getScriptItem(item);
            return typeof item.tpl != 'undefined';
        }
    }

    this.getTpl = function (vEl) {
        if (this.hasTpl(vEl)) {
            var item = vEl.getAttribute('name');
            item = this.getScriptItem(item);
            return item.tpl;
        }
        else if (vEl.hasAttribute('data-tpl')) {
            return vEl.getAttribute('data-tpl');
        }
        return false;
    }

    this.getTplMsg = function (vEl) {
        var itemName = vEl.getAttribute('name');
        var item = this.getScriptItem(itemName);
        if (vEl.hasAttribute('data-tpl-msg')) {
            return vEl.getAttribute('data-tpl-msg');
        }
        else if (typeof item.tplMsg != 'undefined') {
            return item.tplMsg;
        }
        var msgs = this.tpls_msg();
        return msgs[this.getTpl(vEl)];
    }

    this.getScriptItem = function (name) {
        if (typeof name != 'string') {
            name = name.getAttribute('name');
        }
        for (var i = 0; i < this.options.items.length; i++) {
            if (this.options.items[i].item == name) {
                return this.options.items[i];
            }
        }
        return false;
    }

    /*this.generateSuccessMsg = function(vEl){
     vEl.classList.add(this.options.successClass);
     var errorMsg = document.createElement('span');
     errorMsg.classList.add(this.options.successMessageClass);
     errorMsg.innerHTML = msg;
     this.insertAfter(errorMsg, vEl);
     }*/

    this.getSubmitElement = function () {
        var submitElement;

        if (this.options.eventElement[0] == '#') {
            submitElement = document.getElementById(this.options.eventElement.slice(1));
        }
        else {
            submitElement = document.getElementsByClassName(this.options.eventElement.slice(1));
        }
        return submitElement;
    }

    this.getElement = function (el) {
        var thisElement;

        if (el[0] == '#') {
            thisElement = document.getElementById(el.slice(1));
        }
        else {
            thisElement = document.getElementsByClassName(el.slice(1));
        }
        return thisElement;
    }

    this.getValInput = function () {
        var valInput;

        valInput = document.getElementsByClassName(this.options.classItem);

        return valInput;
    }

    this.getInputByName = function (name) {
        return document.getElementsByName(name);
    }

    this.clearInput = function (name) {
        var el = this.getInputByName(name);
        if(el.length > 0){
            for (var i = 0; i < el.length; i++) {
                this.deleteErrorMsg(el[i]);
                el[i].value = '';
            }
        }
    }

    this.insertAfter = function (elem, refElem) {
        var parent = refElem.parentNode;
        var next = refElem.nextSibling;
        if (next) {
            return parent.insertBefore(elem, next);
        } else {
            return parent.appendChild(elem);
        }
    }

    this.findFalse = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === false) {
                return false;
            }
        }
        return true;
    }


    this.ajaxValidPost = function (validationElement, callback) {
        callback = callback || function () {
            };
        if (!this.options.ajax) return;
        var xhr = new XMLHttpRequest();
        var obj = this;
        var flag = false;
        if (validationElement.length > 1) {
            var send = '';
            for (var i = 0; i < validationElement.length; i++) {
                send += validationElement[i].getAttribute('name') + '=' + encodeURIComponent(validationElement[i].value) + '&';
            }
            xhr.open('POST', this.options.ajaxUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                if (xhr.status == 200) {
                    try {
                        var ans = JSON.parse(xhr.responseText);
                    } catch (e) {
                        ans = false;
                    }
                    if(ans){
                        for (var i = 0; i < ans.length; i++) {
                            var vEl = document.getElementsByName(ans[i].item);
                            if (ans[i].status == 0) {
                                obj.deleteErrorMsg(vEl[0]);
                                obj.generateMsg(vEl[0],'error',ans[i].error_msg);
                                flag = true;
                            }
                            else {
                                obj.deleteErrorMsg(vEl[0]);
                                obj.generateMsg(vEl[0],'success');
                            }
                        }
                    }
                }
                else {
                    for (var j = 0; j < validationElement.length; j++) {
                        obj.deleteErrorMsg(validationElement[j]);
                        obj.generateMsg(validationElement[j],'error','Ошибка ' + xhr.status);
                        flag = true;
                    }
                }
            }
            send = send.slice(0, send.length - 1);
            xhr.send(send);
        }
        else {
            if (validationElement.hasAttribute('data-url')) {
                xhr.open('POST', this.options.ajaxUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState != 4) return;
                    if (xhr.status == 200) {
                        try {
                            var ans = JSON.parse(xhr.responseText);
                        } catch (e) {
                            ans = false;
                        }
                        if(ans){
                            if (ans.status == 0) {
                                obj.deleteErrorMsg(validationElement);
                                obj.generateMsg(validationElement,'error',ans.error_msg);
                                /*obj.generateAjaxErrorMsg(validationElement, ans.error_msg);*/
                                flag = true;
                            }
                            else {
                                obj.generateMsg(validationElement,'success');
                                obj.deleteErrorMsg(validationElement);
                            }
                        }
                    }
                    else {
                        obj.deleteErrorMsg(validationElement);
                        obj.generateMsg(validationElement,'error','Ошибка ' + xhr.status);
                        /*obj.generateAjaxErrorMsg(validationElement, 'Ошибка ' + xhr.status);*/
                        flag = true;
                    }
                }

                xhr.send(validationElement.getAttribute('name') + '=' + encodeURIComponent(validationElement.value));
            }
        }
        var form = this.getParent(this.getSubmitElement(), 'FORM');
        xhr.onloadend = function () {
            callback(xhr.responseText, flag, form);
        }
    }

    this.deleteErrorMsg = function (vEl) {
        var item = this.getScriptItem(vEl);
        if (typeof item.errorClass != 'undefined') {
            vEl.classList.remove(item.errorClass);
        }
        if (typeof item.successClass != 'undefined') {
            vEl.classList.remove(item.successClass);
        }
        vEl.classList.remove(this.options.errorClass);
        vEl.classList.remove(this.options.successClass);
        if (vEl.nextElementSibling != null) {
            if (vEl.nextElementSibling.classList.contains(this.getMsgErrorClass(vEl))) {
                vEl.nextElementSibling.remove();
            }
            else if (vEl.nextElementSibling.classList.contains(this.getMsgPromptClass(vEl))) {
                vEl.nextElementSibling.remove();
            }
            else if (vEl.nextElementSibling.classList.contains(this.getMsgSuccessClass(vEl))) {
                vEl.nextElementSibling.remove();
            }
            if (vEl.hasAttribute('data-box')) {
                var msg = document.getElementsByClassName('error-to-' + vEl.getAttribute('name'));
                if (msg.length > 0) {
                    msg[0].remove();
                }
            }
        }
    }

    this.tpl = [];

    this.tpls = function () {
        for (var i = 0; i < this.options.tpl.length; i++) {
            if (this.options.tpl[i].name !== '' && this.options.tpl[i].tpl !== '') {
                this.tpl[this.options.tpl[i].name] = this.options.tpl[i].tpl;
            }
        }
        this.tpl['number'] = /^\d+$/;
        this.tpl['lat'] = /^[a-zA-Z]+$/;
        this.tpl['kir'] = /^[А-Яа-яЁё\s]+$/;
        this.tpl['kir+lat'] = /^[a-zA-ZА-Яа-яЁё\s]+$/;
        this.tpl['kir+number'] = /^[\dА-Яа-яЁё\s]+$/;
        this.tpl['lat+number'] = /^[\da-zA-Z]+$/;
        this.tpl['email'] = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        return this.tpl;
    }

    this.tpl_msg = [];
    this.tpls_msg = function () {
        for (var i = 0; i < this.options.tpl_msg.length; i++) {
            if (this.options.tpl_msg[i].name !== '' && this.options.tpl_msg[i].msg !== '') {
                this.tpl_msg[this.options.tpl_msg[i].name] = this.options.tpl_msg[i].msg;
            }
        }
        this.tpl_msg['number'] = "Толь цифры";
        this.tpl_msg['lat'] = "Только латиница";
        this.tpl_msg['kir'] = "Только кириллица";
        this.tpl_msg['kir+lat'] = "Только кириллица и латиница";
        this.tpl_msg['kir+number'] = "Только кириллица и цифры";
        this.tpl_msg['lat+number'] = "Только латиница и цифры";
        this.tpl_msg['email'] = "Не корректный email";
        return this.tpl_msg;
    }

    this.addTpl = function (name, tpl, msg) {
        this.tpl[name] = tpl;
        this.tpl_msg[name] = msg;
    }
}