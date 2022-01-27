import { reactive } from 'vue'
// A basic store object which is used in different components
const store = {
    debug: true,

    state: reactive({
        counter: 0
    }),

    setCounterAction(value) {
        if (this.debug) {
            console.log('setCounterAction triggered with', value)
        }

        this.state.counter = value
    },

    increaseCounterAction() {
        if (this.debug) {
            console.log('increaseCounterAction triggered')
        }

        this.state.counter += 1
    },

    resetCounterAction() {
        if (this.debug) {
            console.log('resetCounterAction triggered')
        }

        this.state.counter = 0
    }
}

export {
    store
}
