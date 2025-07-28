<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Dashboard</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" color="light">
            <ion-grid>
                <ion-row>
                    <ion-col size="6">
                        <ion-card class="users-card">
                            <ion-card-header>
                                <ion-card-title>Users</ion-card-title>
                            </ion-card-header>
                            <ion-card-content>
                                <h2>{{ users }}</h2>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col size="6">
                        <ion-card class="orders-card">
                            <ion-card-header>
                                <ion-card-title>Orders</ion-card-title>
                            </ion-card-header>
                            <ion-card-content>
                                <h2>{{ orders }}</h2>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="12">
                        <ion-card class="notifications-card">
                            <ion-card-header>
                                <ion-card-title>Notifications</ion-card-title>
                            </ion-card-header>
                            <ion-card-content>
                                <ion-list>
                                    <ion-item v-for="(note, idx) in notifications" :key="idx">
                                        {{ note }}
                                    </ion-item>
                                </ion-list>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem
} from '@ionic/vue';

const users = ref(120);
const orders = ref(45);
const notifications = ref([
    'Welcome to the dashboard!',
    'Order #1234 has been shipped.',
    'New user registered.'
]);
</script>

<style scoped>
ion-card {
    margin-bottom: 16px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.users-card {
    background: linear-gradient(135deg, #4e8cff 60%, #70e1f5 100%);
    color: #fff;
}
.orders-card {
    background: linear-gradient(135deg, #ffb347 60%, #ffcc80 100%);
    color: #fff;
}
.notifications-card {
    background: linear-gradient(135deg, #43e97b 60%, #38f9d7 100%);
    color: #fff;
}
h2 {
    margin: 0;
    font-size: 2rem;
    text-align: center;
    font-weight: bold;
}
ion-card-title {
    font-size: 1.2rem;
    font-weight: 600;
}
ion-item {
    background: transparent;
    color: #333;
}
</style>