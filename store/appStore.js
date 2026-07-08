// store/appStore.js

const appStore = {
  // User Data
  currentUser: null,

  // Driver Data
  currentDriver: null,

  // Booking Data
  currentBooking: null,

  // Navigation
  currentScreen: "home",

  // Language
  language: "hi",

  // Notifications
  notifications: [],

  // Selected Tractor Service
  selectedService: null,

  // Subscription
  subscription: null,


  // ==========================
  // Actions
  // ==========================

  setUser(user) {
    this.currentUser = user;
  },


  setDriver(driver) {
    this.currentDriver = driver;
  },


  setBooking(booking) {
    this.currentBooking = booking;
  },


  setScreen(screen) {
    this.currentScreen = screen;
  },


  setLanguage(language) {
    this.language = language;
  },


  setNotifications(data) {
    this.notifications = data || [];
  },


  setSelectedService(service) {
    this.selectedService = service;
  },


  setSubscription(data) {
    this.subscription = data;
  },


  clearStore() {
    this.currentUser = null;
    this.currentDriver = null;
    this.currentBooking = null;
    this.currentScreen = "home";
    this.notifications = [];
    this.selectedService = null;
    this.subscription = null;
  },
};


export default appStore;
