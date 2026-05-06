import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./pages/Home.vue'),
    },
    {
        path: '/fotovoltaice',
        name: 'fotovoltaice',
        component: () => import('./pages/Fotovoltaice.vue'),
    },
    {
        path: '/infrastructura-grea',
        name: 'infrastructura-grea',
        component: () => import('./pages/InfrastructuraGrea.vue'),
    },
    {
        path: '/automatizari-industriale',
        name: 'automatizari',
        component: () => import('./pages/Automatizari.vue'),
    },
    {
        path: '/despre-noi',
        name: 'despre',
        component: () => import('./pages/Despre.vue'),
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('./pages/Contact.vue'),
    },
];

export default createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        if (to.hash) return { el: to.hash, behavior: 'smooth' };
        return { top: 0 };
    },
});
