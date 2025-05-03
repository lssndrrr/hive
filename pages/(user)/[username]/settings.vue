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
            <UButton
                color="primary"
                variant="link"
                @click="showPasswordModal = true"
            >
                Change Password
            </UButton>
            <UButton
                color="error"
                variant="link"
                @click="showDeleteModal = true"
            >
                Delete Account
            </UButton>
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

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

function changePassword() {
    // Add validation logic here
    console.log('Password changed!')
    showPasswordModal.value = false
}

function confirmDelete() {
    console.log('Account deleted!')
    showDeleteModal.value = false
}
</script>
