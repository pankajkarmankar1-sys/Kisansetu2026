// config/appConfig.js


export const APP_CONFIG = {


  APP_NAME: "KisanSetu",


  VERSION: "2.0.0",


  COUNTRY_CODE: "+91",


  DEFAULT_LANGUAGE: "hi",



  CURRENCY: "₹",



  SUPPORT_EMAIL:
    "support@kisansetu.in",


  SUPPORT_PHONE:
    "+919999999999",



  SUBSCRIPTION_RATE: 550,



  MAX_UPLOAD_SIZE:
    5 * 1024 * 1024,



  ALLOWED_IMAGE_TYPES: [

    "image/jpeg",

    "image/png",

    "image/webp",

  ],



  ALLOWED_DOCUMENT_TYPES: [

    "application/pdf",

    "image/jpeg",

    "image/png",

  ],



  STORAGE_BUCKETS: {

    CUSTOMER:
      "customer-documents",

    DRIVER:
      "driver-documents",

    TRACTOR:
      "tractor-documents",

  },


};
