<template>
    <div
        class="wrapper"
        @click.prevent="executeScript"
        @contextmenu.prevent="editScript"
        :class="{ running: isRunning }"
    >
        <div
            class="text"
            ref="item"
            :class="{ row_overflow: isOverflowing }"
            v-if="!isRunning"
        >
            <div class="line" v-for="(line, index) in lines" :key="index">
                {{ line }}
                <br />
            </div>
        </div>
        <div class="output" v-else>
            {{ output }}
        </div>
        <!-- <div class="right_block">
            <div class="button_run"></div>
        </div> -->
    </div>
</template>

<script>
import { exec } from 'child_process'
import { shell } from 'electron'

export default {
    data() {
        return {
            isOverflowing: false,
            isRunning: false,
            output: null,
            process: null,
        }
    },
    props: {
        text: {
            type: String,
        },
    },
    methods: {
        executeScript() {
            if (this.isRunning) {
                this.isRunning = false
                this.process.kill('SIGINT')
                return
            }

            this.isRunning = true
            this.process = exec(this.text)

            this.process.stdout.on('data', data => {
                this.output = data
                console.log('STDOUT:', data)
            })

            this.process.stderr.on('data', err => {
                console.log('STDERR:', err)
            })

            this.process.on('exit', code => {
                console.log('Process ended with code', code)
            })
        },
        editScript() {
            shell.openItem()
        },
    },
    mounted() {
        const el = this.$refs.item

        this.isOverflowing = el.scrollHeight > el.clientHeight
    },
    computed: {
        lines() {
            return this.text.split(/(?:\r\n|\r|\n)/g)
        },
    },
}
</script>

<style scoped lang="scss">
.wrapper {
    margin-top: 1em;
    width: 90%;
    min-height: 80px;
    max-height: 150px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 5px;
    font-size: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow, transform 0.3s ease, min-height 0.2s ease;

    &:hover {
        box-shadow: 0px 7px 20px 5px rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
    }
}

.running {
    min-height: 150px;
}

.overflow {
    background: radial-gradient(
        121.26% 117.33% at 49.82% 0%,
        #ffffff 0%,
        #ffffff 72.4%,
        #d7d9e8 92.81%
    );
    //overflow: hidden;
}

.row_overflow {
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(transparent 120px, white);
    }
}

.text {
    padding: 1em 1em 1em 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.right_block {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 1em;
}
</style>
