<template>
    <div class="flex flex-col items-center">
        <button @click="requestPermission"
            class="px-4 py-2 text-gray-300 bg-blue-600 rounded shadow-lg hover:bg-blue-700">
            Enable Notifications
        </button>

        <!-- Link to open the Google auth URL in a new window -->

       <!--  <a href="javascript:void(0)" @click="openGoogleAuth" class="mt-4 text-blue-500 hover:underline">
            Authenticate with Google
        </a> -->
    </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref } from "vue";

// Function to open Google auth in a new window
const openGoogleAuth = () => {
    window.open("https://afyatrack.co.tz/google/auth", "_blank");
};

const requestPermission = async () => {
    Swal.fire({
        title: "Requesting Permission",
        text: "We need your permission to send notifications.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Allow",
        cancelButtonText: "Cancel",
    }).then(async (result) => {
        if (!result.isConfirmed) {
            Swal.fire("Permission Denied", "You blocked notifications.", "error");
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            Swal.fire("Blocked", "Notifications are disabled in browser settings.", "error");
            return;
        }

        Swal.fire("Success!", "Permission granted. Subscribing...", "success");

        try {
            const registration = await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BI-eFq9qdXydCtrZ-CaHwM1KEETV3MfkLJyhC8sGHGOrdV_f-C9j8xc_whi9RpONbK4Dg6DPl680RlNkyF0whLY",
            });

            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.content : "";

            await fetch("/push-subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify(subscription),
            });

            Swal.fire("Subscribed!", "You will now receive notifications.", "success");
        } catch (error) {
            console.error("Subscription error:", error);
            Swal.fire("Error", "Subscription failed. Please try again.", "error");
        }
    });
};
</script>
