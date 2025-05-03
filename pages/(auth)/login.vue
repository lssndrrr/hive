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
                        for="username"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                    >
                        Username
                    </label>
                    <UInput
                        id="username"
                        v-model="form.username"
                        type="text"
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
                        v-model="form.password"
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
import { useRouter } from 'vue-router'
import type { LoginPayload } from '~/interfaces/auth'
import { useUserStore } from '~/stores/user'

const show = ref(false)
const form = ref<LoginPayload>({
    username: '',
    password: '',
})

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
    try {
        if (form.value) {
            const res = await userStore.login(form.value)

            if (res.success) {
                // TODO: Add toast showing res.message
                router.push(`${userStore.user?.username}`)
            } else {
                // TODO: Add toast showing res.message and error_msg
                const error_msg =
                    res.error?.detail ??
                    Object.values(res.error || {})
                        .flat()
                        .join('\n') ??
                    'An unknown error occurred.'
            }
        }
    } catch (err: any) {
        console.error('Unexpected error during login:', err)

        if (err instanceof Error) {
            alert(err.message)
        } else {
            alert('Something went wrong. Please try again.')
        }
    }
}
</script>
