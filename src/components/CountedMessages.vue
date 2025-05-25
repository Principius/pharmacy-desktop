<!-- resources/js/Pages/Components/CountedMessages.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
    unreadMessages: Number,
});

const unreadCount = ref(props.unreadMessages);

const fetchUnreadMessages = async () => {
    try {
        const response = await axios.get('/api/unread-messages');
        unreadCount.value = response.data.unreadMessages;
    } catch (error) {
        console.error('Error fetching unread messages:', error);
    }
};

// Fetch messages count periodically
onMounted(() => {
    setInterval(fetchUnreadMessages, 10000);
});

// Show SweetAlert notification when the user hovers over the icon
const showNotification = () => {
    if (unreadCount.value === 0) {
        Swal.fire({
            title: 'No Unread Messages',
            text: 'You have read all your messages!',
            icon: 'info',
            timer: 3000,
            showConfirmButton: false
        });
    }
};
</script>

<template>
    <div class="relative">
        <Link :href="route('chat')">
            <button type="button" @mouseover="showNotification">
                <i class="fa-solid fa-bell text-[25px] dark:text-white"></i>
                <span
                    v-if="unreadCount > 0"
                    class="absolute px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full -top-1 -right-2">
                    {{ unreadCount }}
                </span>
            </button>
        </Link>
    </div>
</template>
