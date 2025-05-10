<template>
    <div class="flex h-screen overflow-hidden">
        <Sidebar />
        <main class="pl-24 flex-1 flex items-center justify-center">
            <slot></slot>
        </main>
    </div>
</template>