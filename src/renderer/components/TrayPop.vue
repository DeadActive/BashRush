<template>
    <div id="wrapper">
        <main>
            <ScriptItem
                v-for="(item, index) in items"
                :key="index"
                :text="item"
                ref="items"
            />
        </main>
    </div>
</template>

<script>
import ScriptItem from '@/components/ScriptItem'

export default {
    data: () => {
        return {
            items: [
                'ls /',
                `echo 'Hello world'`,
                'npm -v',
                'ping ya.ru',
                `echo 'Hello world'\necho 'Hello world'\necho 'Hello world'\necho 'Hello world'\necho 'Hello world'\necho 'Hello world'\necho 'Hello world'\necho 'Hello world'`,
            ],
        }
    },
    components: {
        ScriptItem,
    },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Source Sans Pro', sans-serif;
    color: #000;
}

#wrapper {
    background: radial-gradient(
        ellipse at top left,
        rgb(233, 233, 247) 40%,
        rgb(220, 222, 226) 100%
    );
    height: 100vh;
    width: 100vw;
    border-radius: 10px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 0.5em;
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: white;
        border-radius: 10px;
    }
}

main {
    padding-bottom: 1em;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
}
</style>
