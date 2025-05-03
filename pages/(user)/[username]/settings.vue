<template>
    <Sidebar />
    <div></div>
    <div
        class="flex flex-col min-h-screen items-center justify-center space-y-3 bg-white text-primary"
        style="font-family: 'Nexa'; font-weight: 800"
    >
        <ProfileImageUploader @update:image="userImage = $event" />
        <EditableField v-model="username" label="Username" type="text" />
        <EditableField v-model="firstName" label="First Name" type="text" />
        <EditableField v-model="lastName" label="Last Name" type="text" />
        <EditableField v-model="email" label="Email" type="email" />

        <div class="flex flex-row justify-between w-[620px]">
            <UModal v-model="showPasswordModal">
                <UButton
                    color="primary"
                    variant="link"
                    style="font-weight: 800"
                    @click="showPasswordModal = true"
                >
                    Change Password
                </UButton>

                <template #content>
                    <div
                        class="rounded-5xl p-6 text-black w-full max-w-2xl mx-auto"
                    >
                        <form
                            @submit.prevent="changePassword"
                            class="space-y-4"
                        >
                            <h2
                                class="text-xl font-bold text-center text-black"
                                style="font-family: 'Nexa'; font-weight: 800"
                            >
                                Change Password
                            </h2>

                            <div
                                class="flex flex-col gap-4 text-primary"
                                style="font-family: 'Nexa'; font-weight: 200"
                            >
                                <UInput
                                    v-model="currentPassword"
                                    placeholder="Current Password"
                                    :type="show ? 'text' : 'password'"
                                    color="primary"
                                    variant="soft"
                                    required
                                    :input-class="'text-primary placeholder:text-black'"
                                >
                                    <template #trailing>
                                        <UButton
                                            color="neutral"
                                            variant="link"
                                            size="sm"
                                            :icon="
                                                show
                                                    ? 'i-lucide-eye-off'
                                                    : 'i-lucide-eye'
                                            "
                                            :aria-label="
                                                show
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            "
                                            :aria-pressed="show"
                                            aria-controls="password"
                                            @click="show = !show"
                                        />
                                    </template>
                                </UInput>
                                <UInput
                                    v-model="newPassword"
                                    placeholder="New Password"
                                    :type="showNew ? 'text' : 'password'"
                                    variant="soft"
                                    required
                                >
                                    <template #trailing>
                                        <UButton
                                            color="neutral"
                                            variant="link"
                                            size="sm"
                                            :icon="
                                                showNew
                                                    ? 'i-lucide-eye-off'
                                                    : 'i-lucide-eye'
                                            "
                                            :aria-label="
                                                showNew
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            "
                                            :aria-pressed="showNew"
                                            aria-controls="new-password"
                                            @click="showNew = !showNew"
                                        />
                                    </template>
                                </UInput>
                                <UInput
                                    v-model="confirmPassword"
                                    placeholder="Confirm New Password"
                                    :type="showConfirm ? 'text' : 'password'"
                                    variant="soft"
                                    required
                                >
                                    <template #trailing>
                                        <UButton
                                            color="neutral"
                                            variant="link"
                                            size="sm"
                                            :icon="
                                                showConfirm
                                                    ? 'i-lucide-eye-off'
                                                    : 'i-lucide-eye'
                                            "
                                            :aria-label="
                                                showConfirm
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            "
                                            :aria-pressed="showConfirm"
                                            aria-controls="confirm-password"
                                            @click="showConfirm = !showConfirm"
                                        />
                                    </template>
                                </UInput>
                            </div>

                            <div class="flex justify-center">
                                <UButton
                                    variant="solid"
                                    type="submit"
                                    color="primary"
                                    style="
                                        font-family: 'Nexa';
                                        font-weight: 800;
                                    "
                                    size="xl"
                                >
                                    Submit
                                </UButton>
                            </div>
                        </form>
                    </div>
                </template>
            </UModal>

            <UModal v-model="showDeleteModal">
                <UButton
                    color="error"
                    variant="link"
                    @click="showDeleteModal = true"
                    style="font-weight: 800"
                >
                    Delete Account
                </UButton>
                <template #content>
                    <div class="rounded-xl p-6 max-w-md mx-auto text-center">
                        <h2 class="text-xl font-bold text-red-600 mb-4">
                            Confirm Deletion
                        </h2>
                        <p class="text-gray-700 mb-6">
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </p>
                        <div class="flex justify-center gap-4">
                            <UButton
                                color="error"
                                variant="subtle"
                                @click="confirmDelete"
                                class="font-bold"
                            >
                                Yes, Delete
                            </UButton>
                            <UButton
                                color="secondary"
                                variant="subtle"
                                @click="showDeleteModal = false"
                                class="font-bold"
                            >
                                No, Cancel
                            </UButton>
                        </div>
                    </div>
                </template>
            </UModal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('Lanieza')
const email = ref('lanieza@example.com')
const firstName = ref('John')
const lastName = ref('Doe')

const showPasswordModal = ref(false)
const showDeleteModal = ref(false)

const userImage = ref<string | null>(null)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const show = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

function changePassword() {
    if (newPassword.value !== confirmPassword.value) {
        alert('New passwords do not match!')
        return
    }

    // Add real password update logic here
    console.log('Password changed:', {
        current: currentPassword.value,
        new: newPassword.value,
    })

    showPasswordModal.value = false
    // Clear form
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
}

function confirmDelete() {
    console.log('Account deleted!')
    showDeleteModal.value = false
}
</script>
