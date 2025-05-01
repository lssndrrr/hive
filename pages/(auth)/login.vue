<template>
    <div class="flex min-h-screen items-center justify-center">
        <AppHeader />
        <div
            class="w-full max-w-sm p-10 bg-white rounded-2xl shadow-lg space-y-15 text-black"
        >
            <h1
                class="text-5xl text-primary"
                style="font-family: 'Nexa'; font-weight: 800"
            >
                Login
            </h1>
            <form @submit.prevent="login" class="flex flex-col space-y-6">
                <div class="flex flex-col space-y-2">
                    <label
                        for="email"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                    >
                        Email
                    </label>
                    <UInput
                        id="email"
                        v-model="email"
                        type="email"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :ui="{
                            base: 'bg-white',
                        }"
                    />
                </div>
                <div class="flex flex-col space-y-2">
                    <label
                        for="password"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                        >Password</label
                    >
                    <UInput
                        id="password"
                        v-model="password"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :type="show ? 'text' : 'password'"
                        :ui="{
                            base: 'bg-white',
                            trailing: 'pe-1',
                        }"
                    >
                        <template #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                :icon="
                                    show ? 'i-lucide-eye-off' : 'i-lucide-eye'
                                "
                                :aria-label="
                                    show ? 'Hide password' : 'Show password'
                                "
                                :aria-pressed="show"
                                aria-controls="password"
                                @click="show = !show"
                            />
                        </template>
                    </UInput>
                </div>

                <UButton
                    type="submit"
                    color="secondary"
                    size="xl"
                    style="font-family: 'Nexa'; font-weight: 800"
                    class="w-full flex justify-center hover:bg-primary text-white"
                >
                    LOG IN
                </UButton>
                <p
                    class="text-neutral text-sm text-center"
                    style="font-family: 'Nexa'; font-weight: 200"
                >
                    Don't have an account?
                    <NuxtLink
                        to="/signup"
                        class="text-primary underline hover:text-secondary"
                    >
                        Sign Up
                    </NuxtLink>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const show = ref(false)
const password = ref('')

const login = async () => {
    console.log('Logging in with:', email.value, password.value)
}
</script>
