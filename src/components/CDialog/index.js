import Vue from 'vue'
import VanDialog from './Dialog'

let instance

function Dialog(options) {
    return new Promise((resolve, reject) => {
        if (!instance || !isInDocument(instance.$el)) {
            initInstance()
            Object.assign(instance, Dialog.defaultOptions, options, {
                resolve,
                reject,
            })
            document.body.appendChild(instance.$el)
            setTimeout(() => {
                instance.$emit('input', true)
            })
        } else {
            Object.assign(instance, Dialog.defaultOptions, options, {
                resolve,
                reject,
            })
            instance.$emit('input', true)
        }
    })
}

function isInDocument(element) {
    return document.body.contains(element)
}

function initInstance() {
    if (instance) {
        instance.$destroy()
    }

    instance = new (Vue.extend(VanDialog))({
        el: document.createElement('div'),
    })

    instance.$on('input', (value) => {
        instance.value = value
    })
}

Dialog.alert = Dialog

Dialog.confirm = (options) =>
    Dialog({
        showCancelButton: true,
        ...options,
    })

Dialog.install = () => {
    Vue.use(VanDialog)
}

Dialog.Component = VanDialog

function install() {
    Vue.component(VanDialog.name, VanDialog)
}

install()

Dialog.defaultOptions = {
    title: '',
    message: '',
    value: false,
    overlay: true,
    time: undefined,
    beforeClose: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showConfirmButton: true,
    showCancelButton: false,
    callback: (action) => {
        instance[action === 'confirm' ? 'resolve' : 'reject'](action)
    },
}

Vue.prototype.$Dialog = Dialog

export default Dialog
