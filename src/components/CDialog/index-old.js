/*
 * @Author: LcLichong
 * @Date: 2021-07-06 16:02:57
 * @Last Modified by: LcLichong
 * @Last Modified time: 2021-08-14 22:49:57
 */

import Vue from 'vue'
import './index.less'

function Dialog() {}

let cache = Object.create(null)

Dialog.prototype.alert = function(options) {
    let dialog = 'dialog'
    let overlay = 'overlay'
    if (!cache[dialog]) {
        cache[dialog] = new Vue({
            created() {
                this.title = options.title
                this.message = options.message
                this.time = options.time
            },
            data() {
                return {
                    title: options.title,
                    message: options.message,
                    time: options.time,
                    opacity: false,
                }
            },
            render(h) {
                return h(
                    'div',
                    {
                        class: ['c-dialog', `${this.opacity ? 'c-dialog--show' : 'c-dialog--hide'}`],
                    },
                    [
                        h(
                            'div',
                            {
                                class: 'c-dialog__title',
                            },
                            [this.title]
                        ),
                        h(
                            'div',
                            {
                                domProps: {
                                    innerHTML: this.message,
                                },
                                class: 'c-dialog__content',
                            },
                            []
                        ),
                        h(
                            'div',
                            {
                                class: 'c-dialog__confirm',
                            },
                            [
                                h(
                                    'button',
                                    {
                                        class: 'c-dialog__button',
                                        on: {
                                            click: this.btnClick,
                                        },
                                    },
                                    ['确定']
                                ),
                            ]
                        ),
                    ]
                )
            },
            methods: {
                btnClick() {
                    this.hideDialog()
                },
                showDialog() {
                    if (this.time) {
                        this.opacity = true
                        setTimeout(() => {
                            this.opacity = false
                        }, this.time)
                    } else {
                        this.opacity = true
                    }
                },
                hideDialog() {
                    this.opacity = false
                },
            },
        })

        cache[overlay] = new Vue({
            render(h) {
                return h(
                    'div',
                    {
                        class: [
                            'c-dialog__overlay',
                            `${cache[dialog].opacity ? 'c-dialog__overlay--show' : 'c-dialog__overlay--hide'}`,
                        ],
                    },
                    []
                )
            },
        })
        if (document.body) {
            let overlayDom = cache[overlay].$mount().$el
            document.body.appendChild(overlayDom)
            let dialogDom = cache[dialog].$mount().$el
            document.body.appendChild(dialogDom)

            setTimeout(() => {
                cache[dialog].showDialog()
            })
        }
    } else {
        cache[dialog].title = options.title
        cache[dialog].message = options.message
        cache[dialog].time = options.time
        cache[dialog].showDialog()
    }
}

Dialog.prototype.install = function(Vue) {
    Vue.prototype['$Dialog'] = dialog
}

let dialog = new Dialog()

export default dialog
