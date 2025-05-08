<template>
    <Sidebar />
    <div
        class="flex flex-col min-h-screen items-center justify-center space-y-3 text-primary"
        style="font-family: 'Nexa'; font-weight: 800"
    >
        <div
            class="flex justify-center items-center flex-col space-y-4 relative"
            style="padding-bottom: 30px"
        >
            <div class="parent-container">
                <div class="circle-container">
                    <img src="/img/bee.jpg" alt="" class="profile-image" />
                </div>
            </div>
        </div>

        <EditableField
            v-model="username"
            label="Username"
            type="text"
            @save="updateProfile"
        />
        <EditableField
            v-model="firstName"
            label="First Name"
            type="text"
            @save="updateProfile"
        />
        <EditableField
            v-model="lastName"
            label="Last Name"
            type="text"
            @save="updateProfile"
        />
        <EditableField
            v-model="email"
            label="Email"
            type="email"
            @save="updateProfile"
        />

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
                            @submit.prevent="handlePasswordChange"
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
                                    @click="handlePasswordChange"
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
                        <h2 class="text-xl font-bold text-error mb-4">
                            Confirm Deletion
                        </h2>
                        <p class="text-gray-700 mb-6">
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </p>
                        <div class="flex justify-center gap-4">
                            <UButton
                                color="error"
                                variant="outline"
                                @click="confirmDelete"
                                class="font-bold"
                            >
                                Yes, Delete
                            </UButton>
                        </div>
                    </div>
                </template>
            </UModal>
        </div>
    </div>
</template>

<style>
.parent-container {
    position: relative;
    width: 150px;
    height: 150px;
}
.circle-container {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { ApiResponse, User } from '~/interfaces/common'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const username = ref<string>(user.value?.username ?? '')
const email = ref<string>(user.value?.email ?? '')
const firstName = ref<string>(user.value?.first_name ?? '')
const lastName = ref<string>(user.value?.last_name ?? '')
const userImage = ref<string | null>(null)

const showPasswordModal = ref(false)
const showDeleteModal = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const show = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const router = useRouter()

onMounted(async () => {
    await userStore.fetchUser()

    username.value = userStore.user?.username ?? ''
    email.value = userStore.user?.email ?? ''
    firstName.value = userStore.user?.first_name ?? ''
    lastName.value = userStore.user?.last_name ?? ''
})

definePageMeta({
    layout: 'user',
    middleware: 'auth',
})

async function updateProfile() {
    const updateData: Partial<User> = {
        username: username.value,
        email: email.value,
        first_name: firstName.value,
        last_name: lastName.value,
    }

    const response: ApiResponse<any> = await userStore.updateUser(updateData)

    if (response.success) {
        alert('Profile updated successfully!')
    } else {
        alert(`Update failed: ${response.message}`)
    }
}

async function confirmDelete() {
    const response: ApiResponse<null> = await userStore.deleteAccount()
    if (response.success) {
        alert('Account deleted successfully!')
        router.push('/login')
    } else {
        alert(`Delete failed: ${response.message}`)
    }
    showDeleteModal.value = false
}

const handlePasswordChange = async () => {
    if (newPassword.value !== confirmPassword.value) {
        alert('New passwords do not match!')
        return
    }

    console.log('Password changed:', {
        current: currentPassword.value,
        new: newPassword.value,
    })

    const result = await userStore.changePassword(
        currentPassword.value,
        newPassword.value
    )

    alert(result.message)

    if (result.success) {
        showPasswordModal.value = false
        currentPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    }
}
</script>
