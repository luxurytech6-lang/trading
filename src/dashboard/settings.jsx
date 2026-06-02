import React, { useState, useContext, createContext } from 'react';
import supabase from "../supabase";

/* ─── Translations ──────────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    // Nav sections
    navAccount: 'Account', navPreferences: 'Preferences', navIntegrations: 'Integrations',
    navProfile: 'Profile', navSecurity: 'Security', navSubscription: 'Subscription',
    navNotifications: 'Notifications', navAppearance: 'Appearance', navLanguage: 'Language',
    navPrivacy: 'Privacy', navConnectedApps: 'Connected Apps',
    // Topbar
    accountSettings: 'Account', settingsHighlight: 'Settings',
    // Sidebar
    portfolioValue: 'Portfolio Value', liveFromWallet: 'Live from wallet',
    navMarkets: 'Markets', navSocial: 'Social',
    navDashboard: 'Dashboard', navTrading: 'Trading', navInsights: 'Insights',
    navCopyTrading: 'Copy Trading', navMarketplace: 'Marketplace', navSupport: 'Support',
    // Profile panel
    personalInfo: 'Personal Information', publicProfileDesc: 'Your public-facing profile details.',
    uploadPhoto: 'Upload Photo', photoHint: 'JPG, PNG or GIF · Max 5 MB',
    firstName: 'First Name', lastName: 'Last Name', username: 'Username', bio: 'Bio',
    location: 'Location', website: 'Website', discard: 'Discard', saveChanges: 'Save Changes',
    emailAddress: 'Email Address', manageLoginEmail: 'Manage your login email.',
    currentEmail: 'Current Email', update: 'Update',
    emailWarning: 'Changing your email will require re-verification. You will be logged out of all sessions.',
    // Security panel
    password: 'Password', passwordDesc: 'Use a strong, unique password for your account.',
    currentPassword: 'Current Password', newPassword: 'New Password', confirmPassword: 'Confirm Password',
    updatePassword: 'Update Password',
    twoFactor: 'Two-Factor Authentication', twoFactorDesc: 'Add an extra layer of security to your account.',
    activeSessions: 'Active Sessions', activeSessionsDesc: 'Devices currently signed in to your account.',
    noSessions: 'No active sessions found.', thisDevice: 'This device', revoke: 'Revoke',
    signOutAll: 'Sign Out All Other Devices', active: 'Active',
    // Subscription panel
    currentPlan: 'Current Plan', manageSub: 'Manage your subscription and billing.',
    upgradeElite: 'Upgrade to Elite', manageBilling: 'Manage Billing', viewInvoices: 'View Invoices',
    usageMonth: 'Usage This Month', usageResets: 'Resets on the 1st of each month.',
    priceAlerts: 'Price Alerts', watchlistSpots: 'Watchlist Spots', signalSaves: 'Signal Saves',
    dangerZone: 'Danger Zone', dangerDesc: 'Irreversible actions — proceed with caution.',
    pauseSub: 'Pause Subscription', pauseSubDesc: 'Stop billing without losing your data',
    cancelSub: 'Cancel Subscription', cancelSubDesc: 'Cancels at end of current billing period',
    pause: 'Pause', cancel: 'Cancel',
    // Notifications
    deliveryChannels: 'Delivery Channels', deliveryDesc: 'Choose how you receive notifications.',
    email: 'Email', push: 'Push', telegram: 'Telegram',
    marketAlerts: 'Market & Alerts', marketAlertsDesc: 'Notifications about your watchlist and price alerts.',
    priceAlertsLabel: 'Price Alerts', priceAlertsSub: 'When a tracked asset hits your target price',
    watchlistMovers: 'Watchlist Movers', watchlistMoversSub: 'Daily digest of top movers on your list',
    marketOpenClose: 'Market Open / Close', marketOpenCloseSub: 'Reminder when major markets open',
    breakingNews: 'Breaking News', breakingNewsSub: 'Major macro events affecting your assets',
    accountSystem: 'Account & System', accountSystemDesc: 'Security and account status notifications.',
    loginActivity: 'Login Activity', loginActivitySub: 'New sign-in from an unrecognised device',
    subReminders: 'Subscription Reminders', subRemindersSub: 'Renewal and billing notifications',
    productUpdates: 'Product Updates', productUpdatesSub: 'New features and platform improvements',
    weeklySummary: 'Weekly Summary', weeklySummarySub: 'Weekly digest of your account activity',
    // Appearance
    theme: 'Theme', themeDesc: 'Choose your interface appearance.',
    dark: 'Dark', light: 'Light', system: 'System',
    accentColor: 'Accent Color', accentDesc: 'Personalise your highlight color. Changes apply across all pages instantly.',
    selected: 'Selected',
    layoutDensity: 'Layout Density', layoutDesc: 'Control spacing throughout the interface.',
    compact: 'Compact', compactSub: 'Tighter spacing',
    comfortable: 'Comfortable', comfortableSub: 'Default',
    spacious: 'Spacious', spaciousSub: 'More breathing room',
    savingStatus: 'Saving…', appliedStatus: 'Applied to all pages',
    // Language
    displayLanguage: 'Display Language', displayLanguageDesc: 'Choose the language used across the entire TradeFlow platform.',
    searchLanguage: 'Search language or code…', allRegions: 'All Regions',
    languagesShown: (f, t) => `${f} of ${t} languages shown`,
    resetToEnglish: 'Reset to English', saveLanguage: 'Save Language',
    savingLang: 'Saving…', langSaved: 'Language saved — will apply across all pages',
    aboutLang: 'About Language Settings', aboutLangDesc: 'What changes when you switch language.',
    // Privacy
    profileVisibility: 'Profile Visibility', profileVisibilityDesc: 'Control what others can see on your profile.',
    publicProfile: 'Public Profile', publicProfileSub: 'Your profile is visible to all users',
    showWatchlist: 'Show Watchlist', showWatchlistSub: 'Let others see your saved assets',
    showActivity: 'Show Activity Feed', showActivitySub: 'Display your recent activity on your profile',
    showFollowedTraders: 'Show Followed Traders', showFollowedTradersSub: 'Let others see the traders you follow',
    appearInSearch: 'Appear in Search', appearInSearchSub: 'Show up in user search results',
    dataAnalytics: 'Data & Analytics', dataAnalyticsDesc: 'How your data is used to improve the platform.',
    usageAnalytics: 'Usage Analytics', usageAnalyticsSub: 'Share anonymised usage data to improve the product',
    personalisedFeed: 'Personalised Feed', personalisedFeedSub: 'Use your activity to personalise signal recommendations',
    marketingEmails: 'Marketing Emails', marketingEmailsSub: 'Receive product news and feature announcements',
    yourData: 'Your Data', yourDataDesc: 'Download or delete your personal data.',
    downloadData: 'Download Your Data', downloadDataSub: 'Export all your account data as a ZIP file',
    requestExport: 'Request Export',
    deleteAccount: 'Delete Account', deleteAccountSub: 'Permanently delete your account and all data',
    // Connected
    connectedApps: 'Connected Apps', connectedAppsDesc: 'Third-party integrations linked to your account.',
    connected: 'Connected', connect: 'Connect', disconnect: 'Disconnect',
    // Loading/Error
    loadingSettings: 'Loading settings…', failedSettings: 'Failed to load settings',
    // Loading spinner
    savingAppearance: 'Saving…',
  },
  fr: {
    navAccount: 'Compte', navPreferences: 'Préférences', navIntegrations: 'Intégrations',
    navProfile: 'Profil', navSecurity: 'Sécurité', navSubscription: 'Abonnement',
    navNotifications: 'Notifications', navAppearance: 'Apparence', navLanguage: 'Langue',
    navPrivacy: 'Confidentialité', navConnectedApps: 'Applications connectées',
    accountSettings: 'Compte', settingsHighlight: 'Paramètres',
    portfolioValue: 'Valeur du portefeuille', liveFromWallet: 'En direct du portefeuille',
    navMarkets: 'Marchés', navSocial: 'Social',
    navDashboard: 'Tableau de bord', navTrading: 'Trading', navInsights: 'Insights',
    navCopyTrading: 'Copy Trading', navMarketplace: 'Marché', navSupport: 'Support',
    personalInfo: 'Informations personnelles', publicProfileDesc: 'Vos informations de profil public.',
    uploadPhoto: 'Télécharger une photo', photoHint: 'JPG, PNG ou GIF · Max 5 Mo',
    firstName: 'Prénom', lastName: 'Nom', username: "Nom d'utilisateur", bio: 'Bio',
    location: 'Lieu', website: 'Site web', discard: 'Annuler', saveChanges: 'Enregistrer',
    emailAddress: 'Adresse e-mail', manageLoginEmail: 'Gérez votre e-mail de connexion.',
    currentEmail: 'E-mail actuel', update: 'Mettre à jour',
    emailWarning: 'Modifier votre e-mail nécessitera une nouvelle vérification. Vous serez déconnecté de toutes les sessions.',
    password: 'Mot de passe', passwordDesc: 'Utilisez un mot de passe fort et unique.',
    currentPassword: 'Mot de passe actuel', newPassword: 'Nouveau mot de passe', confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    twoFactor: 'Authentification à deux facteurs', twoFactorDesc: 'Ajoutez une couche de sécurité supplémentaire.',
    activeSessions: 'Sessions actives', activeSessionsDesc: 'Appareils actuellement connectés.',
    noSessions: 'Aucune session active trouvée.', thisDevice: 'Cet appareil', revoke: 'Révoquer',
    signOutAll: 'Déconnecter tous les autres appareils', active: 'Actif',
    currentPlan: 'Plan actuel', manageSub: 'Gérez votre abonnement et facturation.',
    upgradeElite: 'Passer à Elite', manageBilling: 'Gérer la facturation', viewInvoices: 'Voir les factures',
    usageMonth: 'Utilisation ce mois-ci', usageResets: 'Réinitialise le 1er de chaque mois.',
    priceAlerts: 'Alertes de prix', watchlistSpots: 'Spots de liste de surveillance', signalSaves: 'Signaux sauvegardés',
    dangerZone: 'Zone dangereuse', dangerDesc: 'Actions irréversibles — procédez avec prudence.',
    pauseSub: "Suspendre l'abonnement", pauseSubDesc: 'Arrêtez la facturation sans perdre vos données',
    cancelSub: "Annuler l'abonnement", cancelSubDesc: "Annule à la fin de la période de facturation",
    pause: 'Suspendre', cancel: 'Annuler',
    deliveryChannels: 'Canaux de livraison', deliveryDesc: 'Choisissez comment recevoir les notifications.',
    email: 'E-mail', push: 'Push', telegram: 'Telegram',
    marketAlerts: 'Marchés et alertes', marketAlertsDesc: 'Notifications sur votre liste et alertes de prix.',
    priceAlertsLabel: 'Alertes de prix', priceAlertsSub: "Quand un actif atteint votre prix cible",
    watchlistMovers: 'Actifs en mouvement', watchlistMoversSub: 'Résumé quotidien des actifs en hausse',
    marketOpenClose: 'Ouverture / Fermeture du marché', marketOpenCloseSub: 'Rappel à l\'ouverture des marchés',
    breakingNews: 'Actualités', breakingNewsSub: 'Événements macro importants affectant vos actifs',
    accountSystem: 'Compte et système', accountSystemDesc: 'Notifications de sécurité et état du compte.',
    loginActivity: 'Activité de connexion', loginActivitySub: 'Nouvelle connexion depuis un appareil inconnu',
    subReminders: 'Rappels d\'abonnement', subRemindersSub: 'Notifications de renouvellement et facturation',
    productUpdates: 'Mises à jour produit', productUpdatesSub: 'Nouvelles fonctionnalités et améliorations',
    weeklySummary: 'Résumé hebdomadaire', weeklySummarySub: 'Résumé hebdomadaire de votre activité',
    theme: 'Thème', themeDesc: 'Choisissez l\'apparence de l\'interface.',
    dark: 'Sombre', light: 'Clair', system: 'Système',
    accentColor: 'Couleur d\'accent', accentDesc: 'Personnalisez votre couleur de mise en avant.',
    selected: 'Sélectionné',
    layoutDensity: 'Densité de mise en page', layoutDesc: 'Contrôlez l\'espacement dans l\'interface.',
    compact: 'Compact', compactSub: 'Espacement réduit',
    comfortable: 'Confortable', comfortableSub: 'Par défaut',
    spacious: 'Spacieux', spaciousSub: 'Plus d\'espace',
    savingStatus: 'Enregistrement…', appliedStatus: 'Appliqué à toutes les pages',
    displayLanguage: 'Langue d\'affichage', displayLanguageDesc: 'Choisissez la langue utilisée sur la plateforme TradeFlow.',
    searchLanguage: 'Rechercher une langue ou un code…', allRegions: 'Toutes les régions',
    languagesShown: (f, t) => `${f} sur ${t} langues affichées`,
    resetToEnglish: 'Réinitialiser en anglais', saveLanguage: 'Enregistrer la langue',
    savingLang: 'Enregistrement…', langSaved: 'Langue enregistrée — sera appliquée partout',
    aboutLang: 'À propos des paramètres de langue', aboutLangDesc: 'Ce qui change lors du changement de langue.',
    profileVisibility: 'Visibilité du profil', profileVisibilityDesc: 'Contrôlez ce que les autres peuvent voir.',
    publicProfile: 'Profil public', publicProfileSub: 'Votre profil est visible par tous les utilisateurs',
    showWatchlist: 'Afficher la liste de surveillance', showWatchlistSub: 'Permettre aux autres de voir vos actifs sauvegardés',
    showActivity: 'Afficher le fil d\'activité', showActivitySub: 'Afficher votre activité récente sur votre profil',
    showFollowedTraders: 'Afficher les traders suivis', showFollowedTradersSub: 'Permettre aux autres de voir les traders que vous suivez',
    appearInSearch: 'Apparaître dans les recherches', appearInSearchSub: 'Apparaître dans les résultats de recherche',
    dataAnalytics: 'Données et analyses', dataAnalyticsDesc: 'Comment vos données sont utilisées.',
    usageAnalytics: 'Analyses d\'utilisation', usageAnalyticsSub: 'Partager des données d\'utilisation anonymisées',
    personalisedFeed: 'Fil personnalisé', personalisedFeedSub: 'Personnaliser les recommandations de signaux',
    marketingEmails: 'E-mails marketing', marketingEmailsSub: 'Recevoir des nouvelles et annonces de fonctionnalités',
    yourData: 'Vos données', yourDataDesc: 'Télécharger ou supprimer vos données personnelles.',
    downloadData: 'Télécharger vos données', downloadDataSub: 'Exporter toutes vos données sous forme de ZIP',
    requestExport: 'Demander l\'export',
    deleteAccount: 'Supprimer le compte', deleteAccountSub: 'Supprimer définitivement votre compte et toutes les données',
    connectedApps: 'Applications connectées', connectedAppsDesc: 'Intégrations tierces liées à votre compte.',
    connected: 'Connecté', connect: 'Connecter', disconnect: 'Déconnecter',
    loadingSettings: 'Chargement des paramètres…', failedSettings: 'Échec du chargement des paramètres',
    savingAppearance: 'Enregistrement…',
  },
  es: {
    navAccount: 'Cuenta', navPreferences: 'Preferencias', navIntegrations: 'Integraciones',
    navProfile: 'Perfil', navSecurity: 'Seguridad', navSubscription: 'Suscripción',
    navNotifications: 'Notificaciones', navAppearance: 'Apariencia', navLanguage: 'Idioma',
    navPrivacy: 'Privacidad', navConnectedApps: 'Apps conectadas',
    accountSettings: 'Cuenta', settingsHighlight: 'Configuración',
    portfolioValue: 'Valor del portafolio', liveFromWallet: 'En vivo desde la billetera',
    navMarkets: 'Mercados', navSocial: 'Social',
    navDashboard: 'Panel', navTrading: 'Trading', navInsights: 'Perspectivas',
    navCopyTrading: 'Copy Trading', navMarketplace: 'Mercado', navSupport: 'Soporte',
    personalInfo: 'Información personal', publicProfileDesc: 'Detalles de tu perfil público.',
    uploadPhoto: 'Subir foto', photoHint: 'JPG, PNG o GIF · Máx 5 MB',
    firstName: 'Nombre', lastName: 'Apellido', username: 'Usuario', bio: 'Bio',
    location: 'Ubicación', website: 'Sitio web', discard: 'Descartar', saveChanges: 'Guardar cambios',
    emailAddress: 'Correo electrónico', manageLoginEmail: 'Gestiona tu correo de inicio de sesión.',
    currentEmail: 'Correo actual', update: 'Actualizar',
    emailWarning: 'Cambiar tu correo requiere verificación. Serás desconectado de todas las sesiones.',
    password: 'Contraseña', passwordDesc: 'Usa una contraseña fuerte y única.',
    currentPassword: 'Contraseña actual', newPassword: 'Nueva contraseña', confirmPassword: 'Confirmar contraseña',
    updatePassword: 'Actualizar contraseña',
    twoFactor: 'Autenticación de dos factores', twoFactorDesc: 'Agrega una capa extra de seguridad.',
    activeSessions: 'Sesiones activas', activeSessionsDesc: 'Dispositivos actualmente conectados.',
    noSessions: 'No se encontraron sesiones activas.', thisDevice: 'Este dispositivo', revoke: 'Revocar',
    signOutAll: 'Cerrar sesión en todos los demás dispositivos', active: 'Activo',
    currentPlan: 'Plan actual', manageSub: 'Gestiona tu suscripción y facturación.',
    upgradeElite: 'Mejorar a Elite', manageBilling: 'Gestionar facturación', viewInvoices: 'Ver facturas',
    usageMonth: 'Uso este mes', usageResets: 'Se reinicia el 1 de cada mes.',
    priceAlerts: 'Alertas de precio', watchlistSpots: 'Lugares en lista de seguimiento', signalSaves: 'Señales guardadas',
    dangerZone: 'Zona de peligro', dangerDesc: 'Acciones irreversibles — procede con cuidado.',
    pauseSub: 'Pausar suscripción', pauseSubDesc: 'Detener facturación sin perder tus datos',
    cancelSub: 'Cancelar suscripción', cancelSubDesc: 'Cancela al final del período de facturación actual',
    pause: 'Pausar', cancel: 'Cancelar',
    deliveryChannels: 'Canales de entrega', deliveryDesc: 'Elige cómo recibes notificaciones.',
    email: 'Correo', push: 'Push', telegram: 'Telegram',
    marketAlerts: 'Mercados y alertas', marketAlertsDesc: 'Notificaciones sobre tu lista y alertas de precio.',
    priceAlertsLabel: 'Alertas de precio', priceAlertsSub: 'Cuando un activo alcanza tu precio objetivo',
    watchlistMovers: 'Activos en movimiento', watchlistMoversSub: 'Resumen diario de los mayores movimientos',
    marketOpenClose: 'Apertura / Cierre del mercado', marketOpenCloseSub: 'Recordatorio cuando abren los principales mercados',
    breakingNews: 'Noticias de última hora', breakingNewsSub: 'Eventos macro importantes que afectan tus activos',
    accountSystem: 'Cuenta y sistema', accountSystemDesc: 'Notificaciones de seguridad y estado de la cuenta.',
    loginActivity: 'Actividad de inicio de sesión', loginActivitySub: 'Nuevo inicio de sesión desde un dispositivo no reconocido',
    subReminders: 'Recordatorios de suscripción', subRemindersSub: 'Notificaciones de renovación y facturación',
    productUpdates: 'Actualizaciones del producto', productUpdatesSub: 'Nuevas funciones y mejoras de la plataforma',
    weeklySummary: 'Resumen semanal', weeklySummarySub: 'Resumen semanal de tu actividad',
    theme: 'Tema', themeDesc: 'Elige la apariencia de tu interfaz.',
    dark: 'Oscuro', light: 'Claro', system: 'Sistema',
    accentColor: 'Color de acento', accentDesc: 'Personaliza tu color de resaltado.',
    selected: 'Seleccionado',
    layoutDensity: 'Densidad del diseño', layoutDesc: 'Controla el espaciado en la interfaz.',
    compact: 'Compacto', compactSub: 'Espaciado reducido',
    comfortable: 'Confortable', comfortableSub: 'Por defecto',
    spacious: 'Espacioso', spaciousSub: 'Más espacio',
    savingStatus: 'Guardando…', appliedStatus: 'Aplicado a todas las páginas',
    displayLanguage: 'Idioma de visualización', displayLanguageDesc: 'Elige el idioma utilizado en toda la plataforma TradeFlow.',
    searchLanguage: 'Buscar idioma o código…', allRegions: 'Todas las regiones',
    languagesShown: (f, t) => `${f} de ${t} idiomas mostrados`,
    resetToEnglish: 'Restablecer a inglés', saveLanguage: 'Guardar idioma',
    savingLang: 'Guardando…', langSaved: 'Idioma guardado — se aplicará en todas las páginas',
    aboutLang: 'Sobre la configuración de idioma', aboutLangDesc: 'Qué cambia cuando cambias de idioma.',
    profileVisibility: 'Visibilidad del perfil', profileVisibilityDesc: 'Controla lo que otros pueden ver en tu perfil.',
    publicProfile: 'Perfil público', publicProfileSub: 'Tu perfil es visible para todos los usuarios',
    showWatchlist: 'Mostrar lista de seguimiento', showWatchlistSub: 'Permitir que otros vean tus activos guardados',
    showActivity: 'Mostrar actividad', showActivitySub: 'Mostrar tu actividad reciente en tu perfil',
    showFollowedTraders: 'Mostrar traders seguidos', showFollowedTradersSub: 'Permitir que otros vean los traders que sigues',
    appearInSearch: 'Aparecer en búsquedas', appearInSearchSub: 'Aparecer en los resultados de búsqueda',
    dataAnalytics: 'Datos y análisis', dataAnalyticsDesc: 'Cómo se usan tus datos para mejorar la plataforma.',
    usageAnalytics: 'Análisis de uso', usageAnalyticsSub: 'Compartir datos de uso anonimizados para mejorar el producto',
    personalisedFeed: 'Feed personalizado', personalisedFeedSub: 'Usar tu actividad para personalizar las recomendaciones',
    marketingEmails: 'Correos de marketing', marketingEmailsSub: 'Recibir noticias y anuncios de funciones',
    yourData: 'Tus datos', yourDataDesc: 'Descarga o elimina tus datos personales.',
    downloadData: 'Descargar tus datos', downloadDataSub: 'Exportar todos tus datos como un archivo ZIP',
    requestExport: 'Solicitar exportación',
    deleteAccount: 'Eliminar cuenta', deleteAccountSub: 'Eliminar permanentemente tu cuenta y todos los datos',
    connectedApps: 'Apps conectadas', connectedAppsDesc: 'Integraciones de terceros vinculadas a tu cuenta.',
    connected: 'Conectado', connect: 'Conectar', disconnect: 'Desconectar',
    loadingSettings: 'Cargando configuración…', failedSettings: 'Error al cargar la configuración',
    savingAppearance: 'Guardando…',
  },
  de: {
    navAccount: 'Konto', navPreferences: 'Einstellungen', navIntegrations: 'Integrationen',
    navProfile: 'Profil', navSecurity: 'Sicherheit', navSubscription: 'Abonnement',
    navNotifications: 'Benachrichtigungen', navAppearance: 'Darstellung', navLanguage: 'Sprache',
    navPrivacy: 'Datenschutz', navConnectedApps: 'Verbundene Apps',
    accountSettings: 'Konto', settingsHighlight: 'Einstellungen',
    portfolioValue: 'Portfoliowert', liveFromWallet: 'Live aus der Wallet',
    navMarkets: 'Märkte', navSocial: 'Sozial',
    navDashboard: 'Dashboard', navTrading: 'Handel', navInsights: 'Einblicke',
    navCopyTrading: 'Copy Trading', navMarketplace: 'Marktplatz', navSupport: 'Support',
    personalInfo: 'Persönliche Informationen', publicProfileDesc: 'Ihre öffentlichen Profildetails.',
    uploadPhoto: 'Foto hochladen', photoHint: 'JPG, PNG oder GIF · Max 5 MB',
    firstName: 'Vorname', lastName: 'Nachname', username: 'Benutzername', bio: 'Bio',
    location: 'Ort', website: 'Website', discard: 'Verwerfen', saveChanges: 'Änderungen speichern',
    emailAddress: 'E-Mail-Adresse', manageLoginEmail: 'Verwalten Sie Ihre Anmelde-E-Mail.',
    currentEmail: 'Aktuelle E-Mail', update: 'Aktualisieren',
    emailWarning: 'Das Ändern Ihrer E-Mail erfordert eine erneute Verifizierung. Sie werden von allen Sitzungen abgemeldet.',
    password: 'Passwort', passwordDesc: 'Verwenden Sie ein starkes, einzigartiges Passwort.',
    currentPassword: 'Aktuelles Passwort', newPassword: 'Neues Passwort', confirmPassword: 'Passwort bestätigen',
    updatePassword: 'Passwort aktualisieren',
    twoFactor: 'Zwei-Faktor-Authentifizierung', twoFactorDesc: 'Fügen Sie eine zusätzliche Sicherheitsebene hinzu.',
    activeSessions: 'Aktive Sitzungen', activeSessionsDesc: 'Derzeit angemeldete Geräte.',
    noSessions: 'Keine aktiven Sitzungen gefunden.', thisDevice: 'Dieses Gerät', revoke: 'Widerrufen',
    signOutAll: 'Von allen anderen Geräten abmelden', active: 'Aktiv',
    currentPlan: 'Aktueller Plan', manageSub: 'Verwalten Sie Ihr Abonnement und Ihre Abrechnung.',
    upgradeElite: 'Auf Elite upgraden', manageBilling: 'Abrechnung verwalten', viewInvoices: 'Rechnungen anzeigen',
    usageMonth: 'Nutzung diesen Monat', usageResets: 'Wird am 1. jedes Monats zurückgesetzt.',
    priceAlerts: 'Preisalarme', watchlistSpots: 'Watchlist-Plätze', signalSaves: 'Gespeicherte Signale',
    dangerZone: 'Gefahrenzone', dangerDesc: 'Unwiderrufliche Aktionen — mit Vorsicht vorgehen.',
    pauseSub: 'Abonnement pausieren', pauseSubDesc: 'Abrechnung stoppen ohne Datenverlust',
    cancelSub: 'Abonnement kündigen', cancelSubDesc: 'Kündigt am Ende des aktuellen Abrechnungszeitraums',
    pause: 'Pausieren', cancel: 'Kündigen',
    deliveryChannels: 'Übermittlungskanäle', deliveryDesc: 'Wählen Sie, wie Sie Benachrichtigungen erhalten.',
    email: 'E-Mail', push: 'Push', telegram: 'Telegram',
    marketAlerts: 'Märkte & Alarme', marketAlertsDesc: 'Benachrichtigungen zu Ihrer Watchlist und Preisalarmen.',
    priceAlertsLabel: 'Preisalarme', priceAlertsSub: 'Wenn ein verfolgtes Asset Ihren Zielpreis erreicht',
    watchlistMovers: 'Watchlist-Bewegungen', watchlistMoversSub: 'Tägliche Übersicht der größten Bewegungen',
    marketOpenClose: 'Marktöffnung / -schluss', marketOpenCloseSub: 'Erinnerung, wenn wichtige Märkte öffnen',
    breakingNews: 'Eilmeldungen', breakingNewsSub: 'Wichtige Makroereignisse, die Ihre Assets betreffen',
    accountSystem: 'Konto & System', accountSystemDesc: 'Sicherheits- und Kontostatusbenachrichtigungen.',
    loginActivity: 'Anmeldeaktivität', loginActivitySub: 'Neue Anmeldung von einem unbekannten Gerät',
    subReminders: 'Abonnement-Erinnerungen', subRemindersSub: 'Erneuerungs- und Abrechnungsbenachrichtigungen',
    productUpdates: 'Produktaktualisierungen', productUpdatesSub: 'Neue Funktionen und Plattformverbesserungen',
    weeklySummary: 'Wöchentliche Zusammenfassung', weeklySummarySub: 'Wöchentliche Übersicht Ihrer Kontoaktivität',
    theme: 'Thema', themeDesc: 'Wählen Sie das Erscheinungsbild der Oberfläche.',
    dark: 'Dunkel', light: 'Hell', system: 'System',
    accentColor: 'Akzentfarbe', accentDesc: 'Personalisieren Sie Ihre Hervorhebungsfarbe.',
    selected: 'Ausgewählt',
    layoutDensity: 'Layout-Dichte', layoutDesc: 'Steuern Sie den Abstand in der Oberfläche.',
    compact: 'Kompakt', compactSub: 'Engerer Abstand',
    comfortable: 'Komfortabel', comfortableSub: 'Standard',
    spacious: 'Geräumig', spaciousSub: 'Mehr Platz',
    savingStatus: 'Wird gespeichert…', appliedStatus: 'Auf allen Seiten angewendet',
    displayLanguage: 'Anzeigesprache', displayLanguageDesc: 'Wählen Sie die Sprache für die gesamte TradeFlow-Plattform.',
    searchLanguage: 'Sprache oder Code suchen…', allRegions: 'Alle Regionen',
    languagesShown: (f, t) => `${f} von ${t} Sprachen angezeigt`,
    resetToEnglish: 'Auf Englisch zurücksetzen', saveLanguage: 'Sprache speichern',
    savingLang: 'Wird gespeichert…', langSaved: 'Sprache gespeichert — wird auf allen Seiten angewendet',
    aboutLang: 'Über Spracheinstellungen', aboutLangDesc: 'Was sich beim Sprachwechsel ändert.',
    profileVisibility: 'Profilsichtbarkeit', profileVisibilityDesc: 'Steuern Sie, was andere sehen können.',
    publicProfile: 'Öffentliches Profil', publicProfileSub: 'Ihr Profil ist für alle Benutzer sichtbar',
    showWatchlist: 'Watchlist anzeigen', showWatchlistSub: 'Anderen erlauben, Ihre gespeicherten Assets zu sehen',
    showActivity: 'Aktivitätsfeed anzeigen', showActivitySub: 'Ihre neuesten Aktivitäten auf Ihrem Profil anzeigen',
    showFollowedTraders: 'Gefolgte Trader anzeigen', showFollowedTradersSub: 'Anderen erlauben, Ihre gefolgten Trader zu sehen',
    appearInSearch: 'In Suchergebnissen erscheinen', appearInSearchSub: 'In Benutzersuchergebnissen angezeigt werden',
    dataAnalytics: 'Daten & Analysen', dataAnalyticsDesc: 'Wie Ihre Daten zur Verbesserung der Plattform genutzt werden.',
    usageAnalytics: 'Nutzungsanalysen', usageAnalyticsSub: 'Anonymisierte Nutzungsdaten teilen',
    personalisedFeed: 'Personalisierter Feed', personalisedFeedSub: 'Aktivität nutzen, um Signal-Empfehlungen zu personalisieren',
    marketingEmails: 'Marketing-E-Mails', marketingEmailsSub: 'Produktnews und Funktionsankündigungen erhalten',
    yourData: 'Ihre Daten', yourDataDesc: 'Laden Sie Ihre persönlichen Daten herunter oder löschen Sie sie.',
    downloadData: 'Ihre Daten herunterladen', downloadDataSub: 'Alle Kontodaten als ZIP-Datei exportieren',
    requestExport: 'Export anfordern',
    deleteAccount: 'Konto löschen', deleteAccountSub: 'Ihr Konto und alle Daten dauerhaft löschen',
    connectedApps: 'Verbundene Apps', connectedAppsDesc: 'Mit Ihrem Konto verknüpfte Drittanbieter-Integrationen.',
    connected: 'Verbunden', connect: 'Verbinden', disconnect: 'Trennen',
    loadingSettings: 'Einstellungen werden geladen…', failedSettings: 'Einstellungen konnten nicht geladen werden',
    savingAppearance: 'Wird gespeichert…',
  },
  pt: {
    navAccount: 'Conta', navPreferences: 'Preferências', navIntegrations: 'Integrações',
    navProfile: 'Perfil', navSecurity: 'Segurança', navSubscription: 'Assinatura',
    navNotifications: 'Notificações', navAppearance: 'Aparência', navLanguage: 'Idioma',
    navPrivacy: 'Privacidade', navConnectedApps: 'Apps conectados',
    accountSettings: 'Conta', settingsHighlight: 'Configurações',
    portfolioValue: 'Valor do portfólio', liveFromWallet: 'Ao vivo da carteira',
    navMarkets: 'Mercados', navSocial: 'Social',
    navDashboard: 'Painel', navTrading: 'Trading', navInsights: 'Insights',
    navCopyTrading: 'Copy Trading', navMarketplace: 'Mercado', navSupport: 'Suporte',
    personalInfo: 'Informações pessoais', publicProfileDesc: 'Detalhes do seu perfil público.',
    uploadPhoto: 'Enviar foto', photoHint: 'JPG, PNG ou GIF · Máx 5 MB',
    firstName: 'Nome', lastName: 'Sobrenome', username: 'Usuário', bio: 'Bio',
    location: 'Localização', website: 'Site', discard: 'Descartar', saveChanges: 'Salvar alterações',
    emailAddress: 'Endereço de e-mail', manageLoginEmail: 'Gerencie seu e-mail de login.',
    currentEmail: 'E-mail atual', update: 'Atualizar',
    emailWarning: 'Alterar seu e-mail exigirá nova verificação. Você será desconectado de todas as sessões.',
    password: 'Senha', passwordDesc: 'Use uma senha forte e única.',
    currentPassword: 'Senha atual', newPassword: 'Nova senha', confirmPassword: 'Confirmar senha',
    updatePassword: 'Atualizar senha',
    twoFactor: 'Autenticação de dois fatores', twoFactorDesc: 'Adicione uma camada extra de segurança.',
    activeSessions: 'Sessões ativas', activeSessionsDesc: 'Dispositivos atualmente conectados.',
    noSessions: 'Nenhuma sessão ativa encontrada.', thisDevice: 'Este dispositivo', revoke: 'Revogar',
    signOutAll: 'Sair de todos os outros dispositivos', active: 'Ativo',
    currentPlan: 'Plano atual', manageSub: 'Gerencie sua assinatura e cobrança.',
    upgradeElite: 'Upgrade para Elite', manageBilling: 'Gerenciar cobrança', viewInvoices: 'Ver faturas',
    usageMonth: 'Uso este mês', usageResets: 'Reinicia no dia 1 de cada mês.',
    priceAlerts: 'Alertas de preço', watchlistSpots: 'Posições na lista', signalSaves: 'Sinais salvos',
    dangerZone: 'Zona de perigo', dangerDesc: 'Ações irreversíveis — proceda com cautela.',
    pauseSub: 'Pausar assinatura', pauseSubDesc: 'Pare a cobrança sem perder seus dados',
    cancelSub: 'Cancelar assinatura', cancelSubDesc: 'Cancela ao final do período de cobrança atual',
    pause: 'Pausar', cancel: 'Cancelar',
    deliveryChannels: 'Canais de entrega', deliveryDesc: 'Escolha como receber notificações.',
    email: 'E-mail', push: 'Push', telegram: 'Telegram',
    marketAlerts: 'Mercados e alertas', marketAlertsDesc: 'Notificações sobre sua lista e alertas de preço.',
    priceAlertsLabel: 'Alertas de preço', priceAlertsSub: 'Quando um ativo atinge seu preço alvo',
    watchlistMovers: 'Ativos em movimento', watchlistMoversSub: 'Resumo diário dos maiores movimentos',
    marketOpenClose: 'Abertura / Fechamento do mercado', marketOpenCloseSub: 'Lembrete quando os principais mercados abrem',
    breakingNews: 'Notícias de última hora', breakingNewsSub: 'Grandes eventos macro afetando seus ativos',
    accountSystem: 'Conta e sistema', accountSystemDesc: 'Notificações de segurança e status da conta.',
    loginActivity: 'Atividade de login', loginActivitySub: 'Novo login de dispositivo não reconhecido',
    subReminders: 'Lembretes de assinatura', subRemindersSub: 'Notificações de renovação e cobrança',
    productUpdates: 'Atualizações do produto', productUpdatesSub: 'Novos recursos e melhorias da plataforma',
    weeklySummary: 'Resumo semanal', weeklySummarySub: 'Resumo semanal da sua atividade',
    theme: 'Tema', themeDesc: 'Escolha a aparência da interface.',
    dark: 'Escuro', light: 'Claro', system: 'Sistema',
    accentColor: 'Cor de destaque', accentDesc: 'Personalize sua cor de realce.',
    selected: 'Selecionado',
    layoutDensity: 'Densidade do layout', layoutDesc: 'Controle o espaçamento na interface.',
    compact: 'Compacto', compactSub: 'Espaçamento reduzido',
    comfortable: 'Confortável', comfortableSub: 'Padrão',
    spacious: 'Espaçoso', spaciousSub: 'Mais espaço',
    savingStatus: 'Salvando…', appliedStatus: 'Aplicado em todas as páginas',
    displayLanguage: 'Idioma de exibição', displayLanguageDesc: 'Escolha o idioma usado em toda a plataforma TradeFlow.',
    searchLanguage: 'Pesquisar idioma ou código…', allRegions: 'Todas as regiões',
    languagesShown: (f, t) => `${f} de ${t} idiomas exibidos`,
    resetToEnglish: 'Redefinir para inglês', saveLanguage: 'Salvar idioma',
    savingLang: 'Salvando…', langSaved: 'Idioma salvo — será aplicado em todas as páginas',
    aboutLang: 'Sobre as configurações de idioma', aboutLangDesc: 'O que muda ao trocar de idioma.',
    profileVisibility: 'Visibilidade do perfil', profileVisibilityDesc: 'Controle o que outros podem ver no seu perfil.',
    publicProfile: 'Perfil público', publicProfileSub: 'Seu perfil é visível para todos os usuários',
    showWatchlist: 'Mostrar lista de observação', showWatchlistSub: 'Deixar outros verem seus ativos salvos',
    showActivity: 'Mostrar feed de atividade', showActivitySub: 'Exibir sua atividade recente no perfil',
    showFollowedTraders: 'Mostrar traders seguidos', showFollowedTradersSub: 'Deixar outros verem os traders que você segue',
    appearInSearch: 'Aparecer nas buscas', appearInSearchSub: 'Aparecer nos resultados de pesquisa de usuários',
    dataAnalytics: 'Dados e análises', dataAnalyticsDesc: 'Como seus dados são usados para melhorar a plataforma.',
    usageAnalytics: 'Análise de uso', usageAnalyticsSub: 'Compartilhar dados de uso anonimizados',
    personalisedFeed: 'Feed personalizado', personalisedFeedSub: 'Usar sua atividade para personalizar recomendações',
    marketingEmails: 'E-mails de marketing', marketingEmailsSub: 'Receber notícias e anúncios de recursos',
    yourData: 'Seus dados', yourDataDesc: 'Baixe ou exclua seus dados pessoais.',
    downloadData: 'Baixar seus dados', downloadDataSub: 'Exportar todos os dados da conta como ZIP',
    requestExport: 'Solicitar exportação',
    deleteAccount: 'Excluir conta', deleteAccountSub: 'Excluir permanentemente sua conta e todos os dados',
    connectedApps: 'Apps conectados', connectedAppsDesc: 'Integrações de terceiros vinculadas à sua conta.',
    connected: 'Conectado', connect: 'Conectar', disconnect: 'Desconectar',
    loadingSettings: 'Carregando configurações…', failedSettings: 'Falha ao carregar configurações',
    savingAppearance: 'Salvando…',
  },
  zh: {
    navAccount: '账户', navPreferences: '偏好', navIntegrations: '集成',
    navProfile: '个人资料', navSecurity: '安全', navSubscription: '订阅',
    navNotifications: '通知', navAppearance: '外观', navLanguage: '语言',
    navPrivacy: '隐私', navConnectedApps: '已连接应用',
    accountSettings: '账户', settingsHighlight: '设置',
    portfolioValue: '投资组合价值', liveFromWallet: '来自钱包的实时数据',
    navMarkets: '市场', navSocial: '社交',
    navDashboard: '仪表板', navTrading: '交易', navInsights: '洞察',
    navCopyTrading: '跟单交易', navMarketplace: '市场', navSupport: '支持',
    personalInfo: '个人信息', publicProfileDesc: '您的公开资料详情。',
    uploadPhoto: '上传照片', photoHint: 'JPG、PNG 或 GIF · 最大 5 MB',
    firstName: '名', lastName: '姓', username: '用户名', bio: '简介',
    location: '位置', website: '网站', discard: '丢弃', saveChanges: '保存更改',
    emailAddress: '电子邮件地址', manageLoginEmail: '管理您的登录邮箱。',
    currentEmail: '当前邮箱', update: '更新',
    emailWarning: '更改邮箱需要重新验证。您将从所有会话中退出。',
    password: '密码', passwordDesc: '请使用强而独特的密码。',
    currentPassword: '当前密码', newPassword: '新密码', confirmPassword: '确认密码',
    updatePassword: '更新密码',
    twoFactor: '双因素认证', twoFactorDesc: '为您的账户添加额外的安全层。',
    activeSessions: '活跃会话', activeSessionsDesc: '当前登录的设备。',
    noSessions: '未找到活跃会话。', thisDevice: '此设备', revoke: '撤销',
    signOutAll: '退出所有其他设备', active: '活跃',
    currentPlan: '当前计划', manageSub: '管理您的订阅和账单。',
    upgradeElite: '升级到精英版', manageBilling: '管理账单', viewInvoices: '查看发票',
    usageMonth: '本月使用情况', usageResets: '每月1日重置。',
    priceAlerts: '价格提醒', watchlistSpots: '自选股位置', signalSaves: '已保存信号',
    dangerZone: '危险区域', dangerDesc: '不可逆操作 — 请谨慎操作。',
    pauseSub: '暂停订阅', pauseSubDesc: '停止计费而不丢失数据',
    cancelSub: '取消订阅', cancelSubDesc: '在当前账单周期结束时取消',
    pause: '暂停', cancel: '取消',
    deliveryChannels: '推送渠道', deliveryDesc: '选择接收通知的方式。',
    email: '邮件', push: '推送', telegram: 'Telegram',
    marketAlerts: '市场与提醒', marketAlertsDesc: '关于您的自选股和价格提醒的通知。',
    priceAlertsLabel: '价格提醒', priceAlertsSub: '当跟踪资产达到目标价格时',
    watchlistMovers: '自选股变动', watchlistMoversSub: '每日最大涨跌摘要',
    marketOpenClose: '市场开盘/收盘', marketOpenCloseSub: '主要市场开盘提醒',
    breakingNews: '突发新闻', breakingNewsSub: '影响您资产的重大宏观事件',
    accountSystem: '账户与系统', accountSystemDesc: '安全和账户状态通知。',
    loginActivity: '登录活动', loginActivitySub: '来自未识别设备的新登录',
    subReminders: '订阅提醒', subRemindersSub: '续订和账单通知',
    productUpdates: '产品更新', productUpdatesSub: '新功能和平台改进',
    weeklySummary: '每周摘要', weeklySummarySub: '账户活动的每周摘要',
    theme: '主题', themeDesc: '选择界面外观。',
    dark: '深色', light: '浅色', system: '跟随系统',
    accentColor: '强调色', accentDesc: '个性化您的高亮颜色。',
    selected: '已选择',
    layoutDensity: '布局密度', layoutDesc: '控制界面间距。',
    compact: '紧凑', compactSub: '更紧密的间距',
    comfortable: '舒适', comfortableSub: '默认',
    spacious: '宽松', spaciousSub: '更多空间',
    savingStatus: '保存中…', appliedStatus: '已应用到所有页面',
    displayLanguage: '显示语言', displayLanguageDesc: '选择整个 TradeFlow 平台使用的语言。',
    searchLanguage: '搜索语言或代码…', allRegions: '所有地区',
    languagesShown: (f, t) => `显示 ${t} 种语言中的 ${f} 种`,
    resetToEnglish: '重置为英语', saveLanguage: '保存语言',
    savingLang: '保存中…', langSaved: '语言已保存 — 将应用于所有页面',
    aboutLang: '关于语言设置', aboutLangDesc: '切换语言时的变化。',
    profileVisibility: '资料可见性', profileVisibilityDesc: '控制其他人可以看到您资料的哪些内容。',
    publicProfile: '公开资料', publicProfileSub: '您的资料对所有用户可见',
    showWatchlist: '显示自选股', showWatchlistSub: '让其他人看到您保存的资产',
    showActivity: '显示动态', showActivitySub: '在您的资料上显示最近活动',
    showFollowedTraders: '显示关注的交易者', showFollowedTradersSub: '让其他人看到您关注的交易者',
    appearInSearch: '出现在搜索中', appearInSearchSub: '出现在用户搜索结果中',
    dataAnalytics: '数据与分析', dataAnalyticsDesc: '您的数据如何用于改进平台。',
    usageAnalytics: '使用分析', usageAnalyticsSub: '共享匿名使用数据以改进产品',
    personalisedFeed: '个性化推送', personalisedFeedSub: '使用您的活动个性化信号推荐',
    marketingEmails: '营销邮件', marketingEmailsSub: '接收产品新闻和功能公告',
    yourData: '您的数据', yourDataDesc: '下载或删除您的个人数据。',
    downloadData: '下载您的数据', downloadDataSub: '将所有账户数据导出为 ZIP 文件',
    requestExport: '请求导出',
    deleteAccount: '删除账户', deleteAccountSub: '永久删除您的账户和所有数据',
    connectedApps: '已连接应用', connectedAppsDesc: '链接到您账户的第三方集成。',
    connected: '已连接', connect: '连接', disconnect: '断开',
    loadingSettings: '正在加载设置…', failedSettings: '加载设置失败',
    savingAppearance: '保存中…',
  },
  ar: {
    navAccount: 'الحساب', navPreferences: 'التفضيلات', navIntegrations: 'التكاملات',
    navProfile: 'الملف الشخصي', navSecurity: 'الأمان', navSubscription: 'الاشتراك',
    navNotifications: 'الإشعارات', navAppearance: 'المظهر', navLanguage: 'اللغة',
    navPrivacy: 'الخصوصية', navConnectedApps: 'التطبيقات المرتبطة',
    accountSettings: 'الحساب', settingsHighlight: 'الإعدادات',
    portfolioValue: 'قيمة المحفظة', liveFromWallet: 'مباشر من المحفظة',
    navMarkets: 'الأسواق', navSocial: 'الاجتماعي',
    navDashboard: 'لوحة التحكم', navTrading: 'التداول', navInsights: 'الرؤى',
    navCopyTrading: 'التداول بالنسخ', navMarketplace: 'السوق', navSupport: 'الدعم',
    personalInfo: 'المعلومات الشخصية', publicProfileDesc: 'تفاصيل ملفك الشخصي العام.',
    uploadPhoto: 'رفع صورة', photoHint: 'JPG أو PNG أو GIF · الحجم الأقصى 5 ميجابايت',
    firstName: 'الاسم الأول', lastName: 'اسم العائلة', username: 'اسم المستخدم', bio: 'السيرة الذاتية',
    location: 'الموقع', website: 'الموقع الإلكتروني', discard: 'تجاهل', saveChanges: 'حفظ التغييرات',
    emailAddress: 'عنوان البريد الإلكتروني', manageLoginEmail: 'إدارة بريدك الإلكتروني لتسجيل الدخول.',
    currentEmail: 'البريد الإلكتروني الحالي', update: 'تحديث',
    emailWarning: 'تغيير بريدك الإلكتروني يتطلب إعادة التحقق. ستتم مسك جلستك من جميع الأجهزة.',
    password: 'كلمة المرور', passwordDesc: 'استخدم كلمة مرور قوية وفريدة.',
    currentPassword: 'كلمة المرور الحالية', newPassword: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور',
    updatePassword: 'تحديث كلمة المرور',
    twoFactor: 'المصادقة الثنائية', twoFactorDesc: 'أضف طبقة حماية إضافية لحسابك.',
    activeSessions: 'الجلسات النشطة', activeSessionsDesc: 'الأجهزة المتصلة حالياً.',
    noSessions: 'لا توجد جلسات نشطة.', thisDevice: 'هذا الجهاز', revoke: 'إلغاء',
    signOutAll: 'تسجيل الخروج من جميع الأجهزة الأخرى', active: 'نشط',
    currentPlan: 'الخطة الحالية', manageSub: 'إدارة اشتراكك وفواتيرك.',
    upgradeElite: 'الترقية إلى Elite', manageBilling: 'إدارة الفواتير', viewInvoices: 'عرض الفواتير',
    usageMonth: 'الاستخدام هذا الشهر', usageResets: 'تتم إعادة التعيين في الأول من كل شهر.',
    priceAlerts: 'تنبيهات الأسعار', watchlistSpots: 'مواضع قائمة المراقبة', signalSaves: 'الإشارات المحفوظة',
    dangerZone: 'منطقة الخطر', dangerDesc: 'إجراءات لا يمكن التراجع عنها — تصرف بحذر.',
    pauseSub: 'إيقاف الاشتراك مؤقتاً', pauseSubDesc: 'إيقاف الفوترة دون فقدان البيانات',
    cancelSub: 'إلغاء الاشتراك', cancelSubDesc: 'يُلغى في نهاية فترة الفوترة الحالية',
    pause: 'إيقاف مؤقت', cancel: 'إلغاء',
    deliveryChannels: 'قنوات التسليم', deliveryDesc: 'اختر كيفية تلقي الإشعارات.',
    email: 'البريد الإلكتروني', push: 'الدفع', telegram: 'تيليغرام',
    marketAlerts: 'الأسواق والتنبيهات', marketAlertsDesc: 'إشعارات حول قائمة مراقبتك وتنبيهات الأسعار.',
    priceAlertsLabel: 'تنبيهات الأسعار', priceAlertsSub: 'عندما يصل أصل مُتتبَّع إلى سعرك المستهدف',
    watchlistMovers: 'متحركات قائمة المراقبة', watchlistMoversSub: 'ملخص يومي لأكبر التحركات',
    marketOpenClose: 'افتتاح / إغلاق السوق', marketOpenCloseSub: 'تذكير عند افتتاح الأسواق الرئيسية',
    breakingNews: 'أخبار عاجلة', breakingNewsSub: 'أحداث كبرى تؤثر على أصولك',
    accountSystem: 'الحساب والنظام', accountSystemDesc: 'إشعارات الأمان وحالة الحساب.',
    loginActivity: 'نشاط تسجيل الدخول', loginActivitySub: 'تسجيل دخول جديد من جهاز غير معروف',
    subReminders: 'تذكيرات الاشتراك', subRemindersSub: 'إشعارات التجديد والفوترة',
    productUpdates: 'تحديثات المنتج', productUpdatesSub: 'ميزات جديدة وتحسينات للمنصة',
    weeklySummary: 'الملخص الأسبوعي', weeklySummarySub: 'ملخص أسبوعي لنشاط حسابك',
    theme: 'المظهر', themeDesc: 'اختر مظهر واجهتك.',
    dark: 'داكن', light: 'فاتح', system: 'النظام',
    accentColor: 'لون التمييز', accentDesc: 'خصّص لون الإبراز الخاص بك.',
    selected: 'محدد',
    layoutDensity: 'كثافة التخطيط', layoutDesc: 'تحكم في التباعد في جميع أنحاء الواجهة.',
    compact: 'مضغوط', compactSub: 'تباعد أضيق',
    comfortable: 'مريح', comfortableSub: 'افتراضي',
    spacious: 'متسع', spaciousSub: 'مساحة أكبر',
    savingStatus: 'جارٍ الحفظ…', appliedStatus: 'تم التطبيق على جميع الصفحات',
    displayLanguage: 'لغة العرض', displayLanguageDesc: 'اختر اللغة المستخدمة في منصة TradeFlow بأكملها.',
    searchLanguage: 'ابحث عن لغة أو رمز…', allRegions: 'جميع المناطق',
    languagesShown: (f, t) => `${f} من ${t} لغة معروضة`,
    resetToEnglish: 'إعادة تعيين إلى الإنجليزية', saveLanguage: 'حفظ اللغة',
    savingLang: 'جارٍ الحفظ…', langSaved: 'تم حفظ اللغة — سيتم تطبيقها على جميع الصفحات',
    aboutLang: 'حول إعدادات اللغة', aboutLangDesc: 'ما الذي يتغير عند تبديل اللغة.',
    profileVisibility: 'رؤية الملف الشخصي', profileVisibilityDesc: 'تحكم فيما يمكن للآخرين رؤيته.',
    publicProfile: 'الملف الشخصي العام', publicProfileSub: 'ملفك الشخصي مرئي لجميع المستخدمين',
    showWatchlist: 'إظهار قائمة المراقبة', showWatchlistSub: 'السماح للآخرين برؤية أصولك المحفوظة',
    showActivity: 'إظهار خلاصة النشاط', showActivitySub: 'عرض نشاطك الأخير على ملفك الشخصي',
    showFollowedTraders: 'إظهار المتداولين المتابَعين', showFollowedTradersSub: 'السماح للآخرين برؤية المتداولين الذين تتابعهم',
    appearInSearch: 'الظهور في البحث', appearInSearchSub: 'الظهور في نتائج بحث المستخدمين',
    dataAnalytics: 'البيانات والتحليلات', dataAnalyticsDesc: 'كيف تُستخدم بياناتك لتحسين المنصة.',
    usageAnalytics: 'تحليلات الاستخدام', usageAnalyticsSub: 'مشاركة بيانات استخدام مجهولة لتحسين المنتج',
    personalisedFeed: 'خلاصة مخصصة', personalisedFeedSub: 'استخدام نشاطك لتخصيص توصيات الإشارات',
    marketingEmails: 'رسائل تسويقية', marketingEmailsSub: 'تلقي أخبار المنتج وإعلانات الميزات',
    yourData: 'بياناتك', yourDataDesc: 'قم بتنزيل بياناتك الشخصية أو حذفها.',
    downloadData: 'تنزيل بياناتك', downloadDataSub: 'تصدير جميع بيانات الحساب كملف ZIP',
    requestExport: 'طلب التصدير',
    deleteAccount: 'حذف الحساب', deleteAccountSub: 'حذف حسابك وجميع بياناتك نهائياً',
    connectedApps: 'التطبيقات المرتبطة', connectedAppsDesc: 'تكاملات الطرف الثالث المرتبطة بحسابك.',
    connected: 'متصل', connect: 'اتصال', disconnect: 'قطع الاتصال',
    loadingSettings: 'جارٍ تحميل الإعدادات…', failedSettings: 'فشل تحميل الإعدادات',
    savingAppearance: 'جارٍ الحفظ…',
  },
  ja: {
    navAccount: 'アカウント', navPreferences: '設定', navIntegrations: '連携',
    navProfile: 'プロフィール', navSecurity: 'セキュリティ', navSubscription: 'サブスクリプション',
    navNotifications: '通知', navAppearance: '外観', navLanguage: '言語',
    navPrivacy: 'プライバシー', navConnectedApps: '連携アプリ',
    accountSettings: 'アカウント', settingsHighlight: '設定',
    portfolioValue: 'ポートフォリオ価値', liveFromWallet: 'ウォレットからリアルタイム',
    navMarkets: '市場', navSocial: 'ソーシャル',
    navDashboard: 'ダッシュボード', navTrading: 'トレード', navInsights: 'インサイト',
    navCopyTrading: 'コピートレード', navMarketplace: 'マーケット', navSupport: 'サポート',
    personalInfo: '個人情報', publicProfileDesc: 'あなたの公開プロフィール情報。',
    uploadPhoto: '写真をアップロード', photoHint: 'JPG、PNG または GIF · 最大 5MB',
    firstName: '名', lastName: '姓', username: 'ユーザー名', bio: '自己紹介',
    location: '場所', website: 'ウェブサイト', discard: '破棄', saveChanges: '変更を保存',
    emailAddress: 'メールアドレス', manageLoginEmail: 'ログインメールを管理します。',
    currentEmail: '現在のメール', update: '更新',
    emailWarning: 'メールを変更すると再確認が必要です。すべてのセッションからログアウトされます。',
    password: 'パスワード', passwordDesc: '強力で一意のパスワードを使用してください。',
    currentPassword: '現在のパスワード', newPassword: '新しいパスワード', confirmPassword: 'パスワードを確認',
    updatePassword: 'パスワードを更新',
    twoFactor: '二要素認証', twoFactorDesc: 'アカウントにセキュリティレイヤーを追加します。',
    activeSessions: 'アクティブセッション', activeSessionsDesc: '現在サインインしているデバイス。',
    noSessions: 'アクティブなセッションが見つかりません。', thisDevice: 'このデバイス', revoke: '取り消す',
    signOutAll: '他のすべてのデバイスからサインアウト', active: 'アクティブ',
    currentPlan: '現在のプラン', manageSub: 'サブスクリプションと請求を管理します。',
    upgradeElite: 'Eliteにアップグレード', manageBilling: '請求を管理', viewInvoices: '請求書を見る',
    usageMonth: '今月の使用状況', usageResets: '毎月1日にリセットされます。',
    priceAlerts: '価格アラート', watchlistSpots: 'ウォッチリストのスポット', signalSaves: '保存されたシグナル',
    dangerZone: '危険ゾーン', dangerDesc: '取り消せない操作 — 慎重に進めてください。',
    pauseSub: 'サブスクリプションを一時停止', pauseSubDesc: 'データを失わずに請求を停止します',
    cancelSub: 'サブスクリプションをキャンセル', cancelSubDesc: '現在の請求期間の終わりにキャンセルされます',
    pause: '一時停止', cancel: 'キャンセル',
    deliveryChannels: '配信チャンネル', deliveryDesc: '通知の受け取り方法を選択します。',
    email: 'メール', push: 'プッシュ', telegram: 'テレグラム',
    marketAlerts: '市場とアラート', marketAlertsDesc: 'ウォッチリストと価格アラートに関する通知。',
    priceAlertsLabel: '価格アラート', priceAlertsSub: '追跡資産が目標価格に達したとき',
    watchlistMovers: 'ウォッチリストの動き', watchlistMoversSub: '最大の動きの毎日ダイジェスト',
    marketOpenClose: '市場の開始/終了', marketOpenCloseSub: '主要市場が開くときのリマインダー',
    breakingNews: '速報', breakingNewsSub: '資産に影響する主要なマクロイベント',
    accountSystem: 'アカウントとシステム', accountSystemDesc: 'セキュリティとアカウントステータスの通知。',
    loginActivity: 'ログインアクティビティ', loginActivitySub: '未認識デバイスからの新しいサインイン',
    subReminders: 'サブスクリプションリマインダー', subRemindersSub: '更新と請求の通知',
    productUpdates: '製品アップデート', productUpdatesSub: '新機能とプラットフォームの改善',
    weeklySummary: '週次サマリー', weeklySummarySub: 'アカウントアクティビティの週次ダイジェスト',
    theme: 'テーマ', themeDesc: 'インターフェースの外観を選択します。',
    dark: 'ダーク', light: 'ライト', system: 'システム',
    accentColor: 'アクセントカラー', accentDesc: 'ハイライトカラーをパーソナライズします。',
    selected: '選択中',
    layoutDensity: 'レイアウト密度', layoutDesc: 'インターフェース全体の間隔を制御します。',
    compact: 'コンパクト', compactSub: '狭い間隔',
    comfortable: '快適', comfortableSub: 'デフォルト',
    spacious: '広々', spaciousSub: 'より多くの空間',
    savingStatus: '保存中…', appliedStatus: 'すべてのページに適用されました',
    displayLanguage: '表示言語', displayLanguageDesc: 'TradeFlow プラットフォーム全体で使用する言語を選択します。',
    searchLanguage: '言語またはコードを検索…', allRegions: 'すべての地域',
    languagesShown: (f, t) => `${t} 言語中 ${f} 件表示中`,
    resetToEnglish: '英語にリセット', saveLanguage: '言語を保存',
    savingLang: '保存中…', langSaved: '言語が保存されました — すべてのページに適用されます',
    aboutLang: '言語設定について', aboutLangDesc: '言語を切り替えると変わること。',
    profileVisibility: 'プロフィールの公開設定', profileVisibilityDesc: '他のユーザーに見えるものを制御します。',
    publicProfile: '公開プロフィール', publicProfileSub: 'プロフィールはすべてのユーザーに表示されます',
    showWatchlist: 'ウォッチリストを表示', showWatchlistSub: '保存した資産を他のユーザーに見せます',
    showActivity: 'アクティビティフィードを表示', showActivitySub: 'プロフィールに最近のアクティビティを表示します',
    showFollowedTraders: 'フォロートレーダーを表示', showFollowedTradersSub: 'フォローしているトレーダーを他のユーザーに見せます',
    appearInSearch: '検索に表示', appearInSearchSub: 'ユーザー検索結果に表示されます',
    dataAnalytics: 'データと分析', dataAnalyticsDesc: 'データがプラットフォームの改善にどのように使用されるか。',
    usageAnalytics: '使用分析', usageAnalyticsSub: '匿名化された使用データを共有して製品を改善します',
    personalisedFeed: 'パーソナライズされたフィード', personalisedFeedSub: 'アクティビティを使用してシグナル推奨をパーソナライズします',
    marketingEmails: 'マーケティングメール', marketingEmailsSub: '製品ニュースと機能のお知らせを受け取ります',
    yourData: 'あなたのデータ', yourDataDesc: '個人データをダウンロードまたは削除します。',
    downloadData: 'データをダウンロード', downloadDataSub: 'すべてのアカウントデータをZIPファイルとしてエクスポート',
    requestExport: 'エクスポートをリクエスト',
    deleteAccount: 'アカウントを削除', deleteAccountSub: 'アカウントとすべてのデータを完全に削除します',
    connectedApps: '連携アプリ', connectedAppsDesc: 'アカウントにリンクされたサードパーティ統合。',
    connected: '接続済み', connect: '接続', disconnect: '切断',
    loadingSettings: '設定を読み込み中…', failedSettings: '設定の読み込みに失敗しました',
    savingAppearance: '保存中…',
  },
  ru: {
    navAccount: 'Аккаунт', navPreferences: 'Настройки', navIntegrations: 'Интеграции',
    navProfile: 'Профиль', navSecurity: 'Безопасность', navSubscription: 'Подписка',
    navNotifications: 'Уведомления', navAppearance: 'Внешний вид', navLanguage: 'Язык',
    navPrivacy: 'Конфиденциальность', navConnectedApps: 'Подключённые приложения',
    accountSettings: 'Аккаунт', settingsHighlight: 'Настройки',
    portfolioValue: 'Стоимость портфеля', liveFromWallet: 'В реальном времени',
    navMarkets: 'Рынки', navSocial: 'Социальные',
    navDashboard: 'Дашборд', navTrading: 'Торговля', navInsights: 'Аналитика',
    navCopyTrading: 'Копи-трейдинг', navMarketplace: 'Маркетплейс', navSupport: 'Поддержка',
    personalInfo: 'Личные данные', publicProfileDesc: 'Данные вашего публичного профиля.',
    uploadPhoto: 'Загрузить фото', photoHint: 'JPG, PNG или GIF · Макс 5 МБ',
    firstName: 'Имя', lastName: 'Фамилия', username: 'Имя пользователя', bio: 'О себе',
    location: 'Местоположение', website: 'Сайт', discard: 'Отменить', saveChanges: 'Сохранить',
    emailAddress: 'Электронная почта', manageLoginEmail: 'Управляйте вашим email для входа.',
    currentEmail: 'Текущий email', update: 'Обновить',
    emailWarning: 'Изменение email потребует повторной верификации. Вы выйдете из всех сессий.',
    password: 'Пароль', passwordDesc: 'Используйте надёжный и уникальный пароль.',
    currentPassword: 'Текущий пароль', newPassword: 'Новый пароль', confirmPassword: 'Подтвердить пароль',
    updatePassword: 'Обновить пароль',
    twoFactor: 'Двухфакторная аутентификация', twoFactorDesc: 'Добавьте дополнительный уровень защиты.',
    activeSessions: 'Активные сессии', activeSessionsDesc: 'Устройства, вошедшие в аккаунт.',
    noSessions: 'Активных сессий не найдено.', thisDevice: 'Это устройство', revoke: 'Отозвать',
    signOutAll: 'Выйти со всех других устройств', active: 'Активен',
    currentPlan: 'Текущий план', manageSub: 'Управляйте подпиской и счетами.',
    upgradeElite: 'Перейти на Elite', manageBilling: 'Управление счетами', viewInvoices: 'Просмотр счетов',
    usageMonth: 'Использование в этом месяце', usageResets: 'Сбрасывается 1-го числа каждого месяца.',
    priceAlerts: 'Ценовые оповещения', watchlistSpots: 'Места в списке наблюдения', signalSaves: 'Сохранённые сигналы',
    dangerZone: 'Опасная зона', dangerDesc: 'Необратимые действия — действуйте осторожно.',
    pauseSub: 'Приостановить подписку', pauseSubDesc: 'Остановить выставление счетов без потери данных',
    cancelSub: 'Отменить подписку', cancelSubDesc: 'Отменяется в конце текущего расчётного периода',
    pause: 'Приостановить', cancel: 'Отменить',
    deliveryChannels: 'Каналы доставки', deliveryDesc: 'Выберите способ получения уведомлений.',
    email: 'Email', push: 'Push', telegram: 'Telegram',
    marketAlerts: 'Рынки и оповещения', marketAlertsDesc: 'Уведомления о вашем списке и ценовых оповещениях.',
    priceAlertsLabel: 'Ценовые оповещения', priceAlertsSub: 'Когда отслеживаемый актив достигает целевой цены',
    watchlistMovers: 'Движения в списке', watchlistMoversSub: 'Ежедневный дайджест крупнейших движений',
    marketOpenClose: 'Открытие/закрытие рынка', marketOpenCloseSub: 'Напоминание об открытии основных рынков',
    breakingNews: 'Срочные новости', breakingNewsSub: 'Крупные макроэкономические события, влияющие на активы',
    accountSystem: 'Аккаунт и система', accountSystemDesc: 'Уведомления безопасности и статуса аккаунта.',
    loginActivity: 'Активность входа', loginActivitySub: 'Новый вход с неизвестного устройства',
    subReminders: 'Напоминания о подписке', subRemindersSub: 'Уведомления о продлении и выставлении счетов',
    productUpdates: 'Обновления продукта', productUpdatesSub: 'Новые функции и улучшения платформы',
    weeklySummary: 'Еженедельная сводка', weeklySummarySub: 'Еженедельный дайджест активности аккаунта',
    theme: 'Тема', themeDesc: 'Выберите внешний вид интерфейса.',
    dark: 'Тёмная', light: 'Светлая', system: 'Системная',
    accentColor: 'Акцентный цвет', accentDesc: 'Персонализируйте цвет выделения.',
    selected: 'Выбрано',
    layoutDensity: 'Плотность макета', layoutDesc: 'Управляйте отступами в интерфейсе.',
    compact: 'Компактный', compactSub: 'Меньше отступов',
    comfortable: 'Удобный', comfortableSub: 'По умолчанию',
    spacious: 'Просторный', spaciousSub: 'Больше пространства',
    savingStatus: 'Сохранение…', appliedStatus: 'Применено на всех страницах',
    displayLanguage: 'Язык отображения', displayLanguageDesc: 'Выберите язык для всей платформы TradeFlow.',
    searchLanguage: 'Поиск языка или кода…', allRegions: 'Все регионы',
    languagesShown: (f, t) => `${f} из ${t} языков`,
    resetToEnglish: 'Сбросить на английский', saveLanguage: 'Сохранить язык',
    savingLang: 'Сохранение…', langSaved: 'Язык сохранён — будет применён на всех страницах',
    aboutLang: 'О языковых настройках', aboutLangDesc: 'Что меняется при смене языка.',
    profileVisibility: 'Видимость профиля', profileVisibilityDesc: 'Управляйте тем, что видят другие.',
    publicProfile: 'Публичный профиль', publicProfileSub: 'Ваш профиль виден всем пользователям',
    showWatchlist: 'Показывать список наблюдения', showWatchlistSub: 'Позволить другим видеть ваши сохранённые активы',
    showActivity: 'Показывать ленту активности', showActivitySub: 'Отображать последние действия в профиле',
    showFollowedTraders: 'Показывать отслеживаемых трейдеров', showFollowedTradersSub: 'Позволить другим видеть трейдеров, за которыми вы следите',
    appearInSearch: 'Отображаться в поиске', appearInSearchSub: 'Появляться в результатах поиска пользователей',
    dataAnalytics: 'Данные и аналитика', dataAnalyticsDesc: 'Как ваши данные используются для улучшения платформы.',
    usageAnalytics: 'Аналитика использования', usageAnalyticsSub: 'Делиться анонимными данными для улучшения продукта',
    personalisedFeed: 'Персонализированная лента', personalisedFeedSub: 'Использовать активность для персонализации рекомендаций',
    marketingEmails: 'Маркетинговые письма', marketingEmailsSub: 'Получать новости продукта и анонсы функций',
    yourData: 'Ваши данные', yourDataDesc: 'Скачайте или удалите ваши персональные данные.',
    downloadData: 'Скачать данные', downloadDataSub: 'Экспортировать все данные аккаунта в ZIP-файл',
    requestExport: 'Запросить экспорт',
    deleteAccount: 'Удалить аккаунт', deleteAccountSub: 'Безвозвратно удалить аккаунт и все данные',
    connectedApps: 'Подключённые приложения', connectedAppsDesc: 'Сторонние интеграции, связанные с аккаунтом.',
    connected: 'Подключено', connect: 'Подключить', disconnect: 'Отключить',
    loadingSettings: 'Загрузка настроек…', failedSettings: 'Не удалось загрузить настройки',
    savingAppearance: 'Сохранение…',
  },
};

// For any language we don't have full translations for, fall back to English
function getTranslations(langCode) {
  // Try exact match, then language prefix (e.g. 'en-US' -> 'en'), then English
  return TRANSLATIONS[langCode] || TRANSLATIONS[langCode?.split('-')[0]] || TRANSLATIONS['en'];
}

/* ─── Language Context ──────────────────────────────────────────────────────── */
const LanguageContext = createContext({ t: k => k, language: 'en', setLanguage: () => {} });

function useTranslation() {
  return useContext(LanguageContext);
}

const T = {
  bg:'#080b10', s:'#0e1219', s2:'#141922', br:'#1e2535', br2:'#2a3347',
  gr:'#e2e8f0', nt:'#64748b', g:'#c8f560', gd:'rgba(200,245,96,.12)',
  bl:'#60a5fa', rd:'#f87171', gn:'#34d399', pr:'#a78bfa', am:'#f59e0b',
  sans:"'Space Grotesk', sans-serif",
  serif:"'Instrument Serif', serif",
  mono:"'JetBrains Mono', monospace",
};

/* ─── Default user settings (mirrors DB defaults) ───────────────────────────── */
const DEFAULT_SETTINGS = {
  theme:                'dark',
  accent_color:         '#c8f560',
  layout_density:       'comfortable',
  chart_type:           'candle',
  show_volume:          true,
  show_extended_hours:  false,
  show_grid_lines:      true,
  profile_public:       true,
  show_watchlist:       false,
  show_activity:        true,
  show_followed_traders:false,
  appear_in_search:     true,
  usage_analytics:      true,
  personalised_feed:    true,
  marketing_emails:     false,
};

/* ─── Derive CSS variable overrides from user settings ───────────────────────── */
function buildThemeVars(settings) {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  const accent = s.accent_color || '#c8f560';

  const hex = accent.replace('#', '');
  const r   = parseInt(hex.substring(0,2), 16);
  const g   = parseInt(hex.substring(2,4), 16);
  const b   = parseInt(hex.substring(4,6), 16);

  const densityMap = {
    compact:     { mainPad: '14px 18px 32px', metricPad: '12px 14px', topbarH: '52px', sidebarW: '232px' },
    comfortable: { mainPad: '24px 28px 40px', metricPad: '18px 20px', topbarH: '60px', sidebarW: '256px' },
    spacious:    { mainPad: '32px 40px 56px', metricPad: '22px 24px', topbarH: '68px', sidebarW: '272px' },
  };
  const density = densityMap[s.layout_density] || densityMap.comfortable;

  const isDark = s.theme === 'dark' || (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const palette = isDark ? {
    bg: '#080b10', surface: '#0e1219', surface2: '#141922',
    border: '#1e2535', border2: '#2a3347',
    text: '#e2e8f0', muted: '#64748b', faint: '#374151',
  } : {
    bg: '#f0f4f8', surface: '#ffffff', surface2: '#f8fafc',
    border: '#e2e8f0', border2: '#cbd5e1',
    text: '#0f172a', muted: '#64748b', faint: '#94a3b8',
  };

  return `
    --bg:         ${palette.bg};
    --surface:    ${palette.surface};
    --surface2:   ${palette.surface2};
    --border:     ${palette.border};
    --border2:    ${palette.border2};
    --text:       ${palette.text};
    --muted:      ${palette.muted};
    --faint:      ${palette.faint};
    --accent:     ${accent};
    --accent-dim: rgba(${r},${g},${b},.12);
    --accent-glow:rgba(${r},${g},${b},.06);
    --sidebar-w:  ${density.sidebarW};
    --topbar-h:   ${density.topbarH};
    --main-pad:   ${density.mainPad};
    --metric-pad: ${density.metricPad};
  `;
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.10.0/tabler-icons.min.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 14px; }

  :root {
    --bg:#080b10; --surface:#0e1219; --surface2:#141922;
    --border:#1e2535; --border2:#2a3347;
    --text:#e2e8f0; --muted:#64748b; --faint:#374151;
    --accent:#c8f560; --accent-dim:rgba(200,245,96,.12); --accent-glow:rgba(200,245,96,.06);
    --green:#34d399; --green-dim:rgba(52,211,153,.12);
    --red:#f87171; --red-dim:rgba(248,113,113,.12);
    --blue:#60a5fa; --blue-dim:rgba(96,165,250,.12);
    --purple:#a78bfa; --purple-dim:rgba(167,139,250,.12);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,.12);
    --sidebar-w:256px; --topbar-h:60px;
    --sans:'Space Grotesk',sans-serif;
    --serif:'Instrument Serif',serif;
    --mono:'JetBrains Mono',monospace;
    --r-sm:8px; --r-md:12px; --r-lg:16px;
  }

  body, #root {
    font-family:var(--sans); background:var(--bg); color:var(--text);
    height:100vh; overflow:hidden; -webkit-font-smoothing:antialiased;
  }
  a { color:inherit; text-decoration:none; }
  button { font-family:var(--sans); cursor:pointer; border:none; background:none; }
  input, select, textarea { font-family:var(--sans); }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  .in-shell { display:grid; grid-template-columns:var(--sidebar-w) 1fr; height:100vh; overflow:hidden; }

  .in-sidebar {
    background:var(--surface); border-right:1px solid var(--border);
    display:flex; flex-direction:column; height:100vh;
    overflow-y:auto; overflow-x:hidden; position:relative; z-index:100;
    flex-shrink:0; transition:transform .25s cubic-bezier(.4,0,.2,1);
  }
  .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
  .in-sidebar::after {
    content:''; position:absolute; top:0; right:0; width:1px; height:100%;
    background:linear-gradient(180deg,transparent 0%,var(--accent) 30%,var(--border) 60%,transparent 100%);
    opacity:.15; pointer-events:none;
  }

  .in-brand { display:flex; align-items:center; gap:10px; padding:20px 20px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .in-brand-icon { width:34px; height:34px; background:var(--accent); border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .in-brand-icon i { font-size:18px; color:#000; }
  .in-brand-name { font-size:16px; font-weight:700; }
  .in-brand-name em { color:var(--accent); font-style:normal; }

  .in-sb-pill { margin:12px 16px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.18); border-radius:var(--r-md); padding:10px 14px; flex-shrink:0; }
  .in-sb-pill-label { font-size:10px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
  .in-live-dot { width:6px; height:6px; background:var(--green); border-radius:50%; animation:in-pulse 2s infinite; flex-shrink:0; }
  @keyframes in-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .in-sb-pill-val { font-family:var(--mono); font-size:19px; font-weight:600; color:var(--accent); letter-spacing:-.5px; }
  .in-sb-pill-sub { font-size:11px; color:var(--green); margin-top:3px; }

  .in-sb-scroll { flex:1; overflow-y:auto; padding:8px 0; }
  .in-sb-section { padding:10px 20px 4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); }
  .in-sb-link {
    display:flex; align-items:center; gap:11px; padding:9px 20px;
    font-size:13px; font-weight:500; color:var(--muted);
    border-left:2px solid transparent; transition:all .15s; cursor:pointer;
  }
  .in-sb-link i { font-size:18px; flex-shrink:0; }
  .in-sb-link:hover { color:var(--text); background:var(--accent-glow); border-left-color:var(--border2); }
  .in-sb-link.active { color:var(--accent); background:var(--accent-dim); border-left-color:var(--accent); }
  .in-sb-badge { margin-left:auto; font-size:9px; font-weight:700; background:var(--accent); color:#000; padding:2px 6px; border-radius:5px; }

  .in-sb-user { flex-shrink:0; border-top:1px solid var(--border); padding:14px 16px; display:flex; align-items:center; gap:10px; }
  .in-sb-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    box-shadow:0 0 12px rgba(200,245,96,.3);
  }
  .in-sb-user-name { font-size:13px; font-weight:700; }
  .in-sb-user-role { font-size:10px; color:var(--accent); margin-top:1px; }

  .in-right { grid-column:2; display:flex; flex-direction:column; height:100vh; overflow:hidden; }

  .in-topbar {
    height:var(--topbar-h); flex-shrink:0; display:flex; align-items:center;
    padding:0 28px; background:var(--surface); border-bottom:1px solid var(--border); gap:16px; z-index:50;
  }
  .in-topbar-title { font-family:var(--serif); font-size:20px; color:var(--text); flex:1; }
  .in-topbar-title span { color:var(--accent); font-style:italic; }
  .in-tb-icon {
    width:36px; height:36px; border-radius:var(--r-sm); background:var(--surface2);
    border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .15s; color:var(--muted); font-size:18px; position:relative;
  }
  .in-tb-icon:hover { border-color:var(--border2); color:var(--text); }
  .in-notif-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; background:var(--red); border-radius:50%; border:1.5px solid var(--surface); }
  .in-tb-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent) 0%,#78d000 100%);
    color:#000; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center; cursor:pointer;
    box-shadow:0 0 10px rgba(200,245,96,.25);
  }
  .in-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; }
  .in-hamburger span { display:block; width:20px; height:2px; background:var(--text); border-radius:2px; }

  .in-main { flex:1; overflow-y:auto; overflow-x:hidden; padding:24px 28px 40px; }

  /* Buttons */
  .in-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    border-radius:var(--r-sm); font-family:var(--sans); font-weight:600;
    cursor:pointer; transition:all .15s; border:none; text-decoration:none; white-space:nowrap;
  }
  .in-btn-sm { font-size:12px; padding:7px 14px; }
  .in-btn-md { font-size:13px; padding:9px 18px; }
  .in-btn-accent { background:var(--accent); color:#000; }
  .in-btn-accent:hover { opacity:.88; box-shadow:0 0 20px rgba(200,245,96,.3); }
  .in-btn-ghost { background:var(--surface2); border:1px solid var(--border); color:var(--text); }
  .in-btn-ghost:hover { border-color:var(--border2); }
  .in-btn-danger { background:var(--red-dim); border:1px solid rgba(248,113,113,.2); color:var(--red); }
  .in-btn-danger:hover { background:rgba(248,113,113,.2); }

  /* Badge */
  .in-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; white-space:nowrap; }
  .in-badge-green  { background:var(--green-dim);  color:var(--green); }
  .in-badge-blue   { background:var(--blue-dim);   color:var(--blue); }
  .in-badge-gold   { background:var(--accent-dim); color:var(--accent); }
  .in-badge-amber  { background:var(--amber-dim);  color:var(--amber); }
  .in-badge-muted  { background:rgba(100,116,139,.12); color:var(--muted); }

  /* ── SETTINGS PAGE ── */

  .st-layout { display:grid; grid-template-columns:220px 1fr; gap:24px; align-items:start; }

  /* Settings sidebar nav */
  .st-nav { position:sticky; top:0; }
  .st-nav-section { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:var(--faint); padding:0 12px 6px; margin-top:16px; }
  .st-nav-section:first-child { margin-top:0; }
  .st-nav-link {
    display:flex; align-items:center; gap:10px; padding:9px 12px;
    font-size:13px; font-weight:500; color:var(--muted);
    border-radius:var(--r-sm); cursor:pointer; transition:all .15s;
    border:none; background:none; width:100%; text-align:left;
  }
  .st-nav-link i { font-size:17px; flex-shrink:0; }
  .st-nav-link:hover { color:var(--text); background:var(--accent-glow); }
  .st-nav-link.active { color:var(--accent); background:var(--accent-dim); }

  /* Panel */
  .st-panel { display:flex; flex-direction:column; gap:20px; min-width:0; }

  /* Section card */
  .st-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; }
  .st-card-head { padding:18px 22px 14px; border-bottom:1px solid var(--border); }
  .st-card-title { font-size:14px; font-weight:700; display:flex; align-items:center; gap:8px; margin-bottom:3px; }
  .st-card-title i { font-size:17px; color:var(--accent); }
  .st-card-desc { font-size:12px; color:var(--muted); }
  .st-card-body { padding:20px 22px; display:flex; flex-direction:column; gap:18px; }

  /* Row — label + control */
  .st-row { display:flex; align-items:center; justify-content:space-between; gap:20px; }
  .st-row-info { flex:1; min-width:0; }
  .st-row-label { font-size:13px; font-weight:600; margin-bottom:3px; }
  .st-row-sub { font-size:11px; color:var(--muted); line-height:1.4; }
  .st-divider { height:1px; background:var(--border); }

  /* Toggle */
  .st-toggle { position:relative; width:40px; height:22px; flex-shrink:0; cursor:pointer; }
  .st-toggle input { opacity:0; width:0; height:0; position:absolute; }
  .st-track {
    position:absolute; inset:0; border-radius:11px;
    background:var(--br2); transition:background .2s;
  }
  .st-toggle input:checked ~ .st-track { background:var(--accent); }
  .st-thumb {
    position:absolute; top:3px; left:3px;
    width:16px; height:16px; border-radius:50%;
    background:#fff; transition:transform .2s;
    pointer-events:none;
  }
  .st-toggle input:checked ~ .st-thumb { transform:translateX(18px); background:#000; }

  /* Input */
  .st-input {
    background:var(--surface2); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:8px 12px; font-size:13px; outline:none;
    transition:border-color .15s; width:100%;
  }
  .st-input:focus { border-color:var(--accent); }
  .st-input-group { display:flex; flex-direction:column; gap:6px; width:100%; }
  .st-input-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--muted); }
  .st-input-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  /* Select */
  .st-select {
    background:var(--surface2); border:1px solid var(--border); color:var(--text);
    border-radius:var(--r-sm); padding:8px 12px; font-size:13px; outline:none;
    cursor:pointer; transition:border-color .15s; min-width:160px;
  }
  .st-select:focus { border-color:var(--accent); }

  /* Connected account row */
  .st-conn { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .st-conn:last-child { border-bottom:none; padding-bottom:0; }
  .st-conn-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .st-conn-name { font-size:13px; font-weight:700; margin-bottom:2px; }
  .st-conn-sub { font-size:11px; color:var(--muted); }

  /* Session row */
  .st-session { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .st-session:last-child { border-bottom:none; padding-bottom:0; }
  .st-session-icon { width:34px; height:34px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:16px; color:var(--muted); flex-shrink:0; }
  .st-session-device { font-size:12px; font-weight:700; margin-bottom:2px; }
  .st-session-sub { font-size:11px; color:var(--muted); }
  .st-session-current { font-size:10px; font-weight:700; color:var(--green); background:var(--green-dim); padding:2px 8px; border-radius:4px; }

  /* Plan card */
  .st-plan-card {
    background:linear-gradient(135deg,rgba(200,245,96,.07) 0%,rgba(200,245,96,.03) 100%);
    border:1px solid rgba(200,245,96,.18); border-radius:var(--r-md); padding:16px 18px;
    display:flex; align-items:center; gap:16px;
  }
  .st-plan-icon { width:42px; height:42px; border-radius:10px; background:var(--accent-dim); border:1px solid rgba(200,245,96,.2); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .st-plan-name { font-size:15px; font-weight:700; color:var(--accent); margin-bottom:3px; }
  .st-plan-desc { font-size:11px; color:var(--muted); }

  /* Usage bar */
  .st-usage { display:flex; flex-direction:column; gap:14px; }
  .st-usage-row {}
  .st-usage-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
  .st-usage-label { font-size:12px; font-weight:600; }
  .st-usage-val { font-family:var(--mono); font-size:11px; color:var(--muted); }
  .st-usage-track { height:5px; background:var(--br2); border-radius:4px; overflow:hidden; }
  .st-usage-fill { height:100%; border-radius:4px; transition:width .3s; }

  /* Danger zone */
  .st-danger-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 0; border-bottom:1px solid var(--border); }
  .st-danger-row:last-child { border-bottom:none; padding-bottom:0; }

  /* Alert */
  .st-alert { border-radius:var(--r-sm); padding:12px 14px; font-size:12px; line-height:1.5; display:flex; align-items:flex-start; gap:10px; }
  .st-alert-warn { background:var(--amber-dim); border:1px solid rgba(245,158,11,.2); color:var(--am); }
  .st-alert i { font-size:16px; flex-shrink:0; margin-top:1px; }

  /* Responsive */
  @media (max-width:900px) {
    .st-layout { grid-template-columns:1fr; }
    .st-nav { position:static; display:flex; gap:4px; flex-wrap:wrap; overflow-x:auto; padding-bottom:8px; }
    .st-nav-section { display:none; }
    .st-nav-link { padding:7px 12px; white-space:nowrap; }
  }
  @media (max-width:768px) {
    .in-shell { grid-template-columns:1fr !important; }
    .in-sidebar { position:fixed !important; top:0 !important; left:0 !important; transform:translateX(-100%) !important; z-index:300 !important; }
    .in-sidebar.open { transform:translateX(0) !important; box-shadow:4px 0 32px rgba(0,0,0,.6) !important; }
    .in-right { grid-column:1; }
    .in-hamburger { display:flex; }
    .st-input-row { grid-template-columns:1fr; }
  }
  @media (max-width:600px) {
    .in-main { padding:16px; }
    .in-topbar { padding:0 16px; }
  }
`;

/* ─── Nav sections ─────────────────────────────────── */
const NAV_SECTIONS = [
  {
    labelKey: 'navAccount',
    items: [
      { key: 'profile',      icon: 'ti-user',           labelKey: 'navProfile'       },
      { key: 'security',     icon: 'ti-shield-lock',    labelKey: 'navSecurity'      },
      { key: 'subscription', icon: 'ti-credit-card',    labelKey: 'navSubscription'  },
    ],
  },
  {
    labelKey: 'navPreferences',
    items: [
      { key: 'notifications', icon: 'ti-bell',          labelKey: 'navNotifications' },
      { key: 'appearance',    icon: 'ti-palette',       labelKey: 'navAppearance'    },
      { key: 'language',      icon: 'ti-language',      labelKey: 'navLanguage'      },
      { key: 'privacy',       icon: 'ti-eye-off',       labelKey: 'navPrivacy'       },
    ],
  },
  {
    labelKey: 'navIntegrations',
    items: [
      { key: 'connected',    icon: 'ti-plug',           labelKey: 'navConnectedApps' },
    ],
  },
];

/* ─── Toggle component ──────────────────────────────── */
function Toggle({ defaultChecked = false, onChange }) {
  const [on, setOn] = useState(defaultChecked);
  const handle = () => { setOn(v => !v); onChange && onChange(!on); };
  return (
    <label className="st-toggle">
      <input type="checkbox" checked={on} onChange={handle} />
      <span className="st-track" />
      <span className="st-thumb" />
    </label>
  );
}


/* ─── Data hook ──────────────────────────────────────── */
function useSettingsData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  React.useEffect(() => {
    async function load() {
      try {
        const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !authUser) throw new Error('Not authenticated');
        const uid = authUser.id;

        const [
          userRes, subRes, walletRes, settingsRes,
          twoFaRes, sessionsRes, appsRes,
          usageRes, copyRes, notifRes,
        ] = await Promise.all([
          supabase.from('users').select('*').eq('id', uid).single(),
          supabase.from('user_subscriptions')
            .select('*, subscription_plans(*)')
            .eq('user_id', uid).eq('status', 'active')
            .order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('wallets')
            .select('balance, currency').eq('user_id', uid).eq('currency', 'USD').maybeSingle(),
          supabase.from('user_settings')
            .select('*').eq('user_id', uid).maybeSingle(),
          supabase.from('two_factor_methods')
            .select('*').eq('user_id', uid),
          supabase.from('sessions')
            .select('*').eq('user_id', uid)
            .order('last_active_at', { ascending: false }).limit(5),
          supabase.from('connected_apps')
            .select('*').eq('user_id', uid),
          supabase.from('usage_metrics')
            .select('*').eq('user_id', uid)
            .order('period_start', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('copy_relationships')
            .select('id').eq('copier_id', uid).eq('status', 'active'),
          supabase.from('notifications')
            .select('id, is_read').eq('user_id', uid).eq('is_read', false).limit(99),
        ]);

        if (userRes.error) throw userRes.error;

        setData({
          user:        userRes.data,
          subscription: subRes.data,
          wallet:      walletRes.data,
          settings:    settingsRes.data,
          twoFa:       twoFaRes.data    || [],
          sessions:    sessionsRes.data || [],
          apps:        appsRes.data     || [],
          usage:       usageRes.data,
          copyCount:   (copyRes.data    || []).length,
          unreadCount: (notifRes.data   || []).length,
        });
      } catch (e) {
        setError(e.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}

function fmtMoney(n, currency = 'USD') {
  if (n == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}
function initials(name = '') {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}
function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function timeAgo(ts) {
  if (!ts) return '—';
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return fmtDate(ts);
}

function ProfilePanel({ user = {} }) {
  const { t } = useTranslation();
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-user" />{t('personalInfo')}</div>
          <div className="st-card-desc">{t('publicProfileDesc')}</div>
        </div>
        <div className="st-card-body">
          {/* Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{
              width:72, height:72, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg,#c8f560 0%,#78d000 100%)',
              color:'#000', fontSize:24, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 20px rgba(200,245,96,.3)',
            }}>{initials(`${user.first_name || ''} ${user.last_name || ''}`)}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button className="in-btn in-btn-ghost in-btn-sm"><i className="ti ti-upload" /> {t('uploadPhoto')}</button>
              <div style={{ fontSize:11, color:T.nt }}>{t('photoHint')}</div>
            </div>
          </div>

          <div className="st-divider" />

          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">{t('firstName')}</div>
              <input className="st-input" defaultValue={user.first_name || ''} />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">{t('lastName')}</div>
              <input className="st-input" defaultValue={user.last_name || ''} />
            </div>
          </div>
          <div className="st-input-group">
            <div className="st-input-label">{t('username')}</div>
            <input className="st-input" defaultValue={user.handle || ''} />
          </div>
          <div className="st-input-group">
            <div className="st-input-label">{t('bio')}</div>
            <textarea className="st-input" rows={3} style={{ resize:'vertical' }}
              defaultValue={user.bio || ''} />
          </div>
          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">{t('location')}</div>
              <input className="st-input" defaultValue={user.location || ''} />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">{t('website')}</div>
              <input className="st-input" defaultValue={user.website || ''} />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <button className="in-btn in-btn-ghost in-btn-sm">{t('discard')}</button>
            <button className="in-btn in-btn-accent in-btn-sm"><i className="ti ti-check" /> {t('saveChanges')}</button>
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-mail" />{t('emailAddress')}</div>
          <div className="st-card-desc">{t('manageLoginEmail')}</div>
        </div>
        <div className="st-card-body">
          <div className="st-input-group">
            <div className="st-input-label">{t('currentEmail')}</div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="st-input" defaultValue={user.email || ''} />
              <button className="in-btn in-btn-ghost in-btn-sm" style={{ flexShrink:0 }}>{t('update')}</button>
            </div>
          </div>
          <div className="st-alert st-alert-warn">
            <i className="ti ti-alert-triangle" />
            {t('emailWarning')}
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityPanel({ twoFa = [], sessions = [] }) {
  const { t } = useTranslation();
  // Map DB method names to display config
  const twoFaConfig = [
    { method:'authenticator_app', icon:'ti-brand-google', label:'Authenticator App', sub:'Use Google Authenticator or similar', iconBg:'rgba(96,165,250,.12)', iconCol:'#60a5fa' },
    { method:'sms',              icon:'ti-message',      label:'SMS Verification',   sub:'Receive codes via text message',      iconBg:'rgba(52,211,153,.12)', iconCol:'#34d399' },
    { method:'email_otp',       icon:'ti-mail',         label:'Email OTP',          sub:'Receive codes to your email',          iconBg:'rgba(200,245,96,.12)', iconCol:'#c8f560' },
  ].map(cfg => ({ ...cfg, enabled: twoFa.find(t => t.method === cfg.method)?.is_enabled || false }));
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-lock" />{t('password')}</div>
          <div className="st-card-desc">{t('passwordDesc')}</div>
        </div>
        <div className="st-card-body">
          <div className="st-input-group">
            <div className="st-input-label">{t('currentPassword')}</div>
            <input className="st-input" type="password" placeholder="••••••••••••" />
          </div>
          <div className="st-input-row">
            <div className="st-input-group">
              <div className="st-input-label">{t('newPassword')}</div>
              <input className="st-input" type="password" placeholder="••••••••••••" />
            </div>
            <div className="st-input-group">
              <div className="st-input-label">{t('confirmPassword')}</div>
              <input className="st-input" type="password" placeholder="••••••••••••" />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button className="in-btn in-btn-accent in-btn-sm"><i className="ti ti-lock" /> {t('updatePassword')}</button>
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-device-mobile" />{t('twoFactor')}</div>
          <div className="st-card-desc">{t('twoFactorDesc')}</div>
        </div>
        <div className="st-card-body">
          {twoFaConfig.map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:m.iconBg, color:m.iconCol, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>
                    <i className={`ti ${m.icon}`} />
                  </div>
                  <div className="st-row-info">
                    <div className="st-row-label" style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {m.label}
                      {m.enabled && <span className="in-badge in-badge-green">{t('active')}</span>}
                    </div>
                    <div className="st-row-sub">{m.sub}</div>
                  </div>
                </div>
                <Toggle defaultChecked={m.enabled} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-devices" />{t('activeSessions')}</div>
          <div className="st-card-desc">{t('activeSessionsDesc')}</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {sessions.length === 0 && (
            <div style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>{t('noSessions')}</div>
          )}
          {sessions.map((s, i) => (
            <div key={i} className="st-session">
              <div className="st-session-icon"><i className="ti ti-device-laptop" /></div>
              <div style={{ flex:1 }}>
                <div className="st-session-device">{s.device || 'Unknown device'}</div>
                <div className="st-session-sub">{s.location || '—'} · {timeAgo(s.last_active_at)}</div>
              </div>
              {s.is_current
                ? <span className="st-session-current">{t('thisDevice')}</span>
                : <button className="in-btn in-btn-ghost in-btn-sm" style={{ color:T.rd }}>{t('revoke')}</button>
              }
            </div>
          ))}
          <div style={{ marginTop:12 }}>
            <button className="in-btn in-btn-danger in-btn-sm"><i className="ti ti-logout" /> {t('signOutAll')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionPanel({ subscription, usage }) {
  const { t } = useTranslation();
  const plan = subscription?.subscription_plans;
  const renewDate = subscription?.current_period_end ? fmtDate(subscription.current_period_end) : '—';
  const planName = plan ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1) + ' Plan' : 'Basic Plan';
  const usages = [
    { label: t('priceAlerts'),    used: usage?.alerts_used    || 0, total: plan?.max_alerts       || 10,   color:'#c8f560' },
    { label: t('watchlistSpots'), used: usage?.watchlist_used || 0, total: plan?.max_watchlist     || 20,   color:'#60a5fa' },
    { label: t('signalSaves'),   used: usage?.signal_saves   || 0, total: 20,                              color:'#a78bfa' },
  ];
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-credit-card" />{t('currentPlan')}</div>
          <div className="st-card-desc">{t('manageSub')}</div>
        </div>
        <div className="st-card-body">
          <div className="st-plan-card">
            <div className="st-plan-icon">⚡</div>
            <div style={{ flex:1 }}>
              <div className="st-plan-name">{planName}</div>
              <div className="st-plan-desc">Renews {renewDate} · Billed {subscription?.billing_cycle || 'monthly'}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:T.mono, fontSize:20, fontWeight:700, color:T.gr }}>{plan ? `$${Number(plan.monthly_price).toFixed(0)}` : 'Free'}<span style={{ fontSize:12, color:T.nt, fontFamily:T.sans }}>/mo</span></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="in-btn in-btn-accent in-btn-sm"><i className="ti ti-rocket" /> {t('upgradeElite')}</button>
            <button className="in-btn in-btn-ghost in-btn-sm">{t('manageBilling')}</button>
            <button className="in-btn in-btn-ghost in-btn-sm">{t('viewInvoices')}</button>
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-chart-bar" />{t('usageMonth')}</div>
          <div className="st-card-desc">{t('usageResets')}</div>
        </div>
        <div className="st-card-body">
          <div className="st-usage">
            {usages.map(u => (
              <div key={u.label} className="st-usage-row">
                <div className="st-usage-head">
                  <div className="st-usage-label">{u.label}</div>
                  <div className="st-usage-val">{u.used.toLocaleString()} / {u.total.toLocaleString()}</div>
                </div>
                <div className="st-usage-track">
                  <div className="st-usage-fill" style={{ width:`${Math.round(u.used/u.total*100)}%`, background:u.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title" style={{ color:T.nt }}><i className="ti ti-alert-triangle" style={{ color:T.nt }} />Danger Zone</div>
          <div className="st-card-desc">Irreversible actions — proceed with caution.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {[
            { label:'Pause Subscription',  sub:'Stop billing without losing your data',  btn:'Pause',  btnClass:'in-btn-ghost' },
            { label:'Cancel Subscription', sub:'Cancels at end of current billing period', btn:'Cancel', btnClass:'in-btn-ghost' },
          ].map((r, i) => (
            <div key={i} className="st-danger-row">
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{r.label}</div>
                <div style={{ fontSize:11, color:T.nt }}>{r.sub}</div>
              </div>
              <button className={`in-btn ${r.btnClass} in-btn-sm`}>{r.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const groups = [
    {
      title:'Market & Alerts', icon:'ti-bell', desc:'Notifications about your watchlist and price alerts.',
      rows:[
        { label:'Price Alerts', sub:'When a tracked asset hits your target price', def:true  },
        { label:'Watchlist Movers', sub:'Daily digest of top movers on your list', def:true  },
        { label:'Market Open / Close', sub:'Reminder when major markets open', def:false },
        { label:'Breaking News', sub:'Major macro events affecting your assets', def:false },
      ],
    },
    {
      title:'Account & System', icon:'ti-shield', desc:'Security and account status notifications.',
      rows:[
        { label:'Login Activity', sub:'New sign-in from an unrecognised device',    def:true },
        { label:'Subscription Reminders', sub:'Renewal and billing notifications',  def:true },
        { label:'Product Updates', sub:'New features and platform improvements',    def:false },
        { label:'Weekly Summary', sub:'Weekly digest of your account activity',     def:false },
      ],
    },
  ];

  const channels = [
    { icon:'ti-mail',       label:'Email', key:'email' },
    { icon:'ti-device-mobile', label:'Push', key:'push' },
    { icon:'ti-brand-telegram', label:'Telegram', key:'telegram' },
  ];

  return (
    <div className="st-panel">
      {/* Delivery channels */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-send" />Delivery Channels</div>
          <div className="st-card-desc">Choose how you receive notifications.</div>
        </div>
        <div className="st-card-body">
          {channels.map((c, i) => (
            <React.Fragment key={c.key}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:T.s2, border:`1px solid ${T.br}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:T.nt }}>
                    <i className={`ti ${c.icon}`} />
                  </div>
                  <div className="st-row-label">{c.label}</div>
                </div>
                <Toggle defaultChecked={c.key !== 'telegram'} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Per-group settings */}
      {groups.map(g => (
        <div key={g.title} className="st-card">
          <div className="st-card-head">
            <div className="st-card-title"><i className={`ti ${g.icon}`} />{g.title}</div>
            <div className="st-card-desc">{g.desc}</div>
          </div>
          <div className="st-card-body">
            {g.rows.map((r, i) => (
              <React.Fragment key={r.label}>
                {i > 0 && <div className="st-divider" />}
                <div className="st-row">
                  <div className="st-row-info">
                    <div className="st-row-label">{r.label}</div>
                    <div className="st-row-sub">{r.sub}</div>
                  </div>
                  <Toggle defaultChecked={r.def} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Appearance helpers (imported by every page) ───────────────────────────── */
// Call applyAppearance() once at the top of any page to pick up saved settings.
export function applyAppearance() {
  try {
    const raw = localStorage.getItem('tf_appearance');
    if (!raw) return;
    const s = JSON.parse(raw);
    _applyToDOM(s);
  } catch (_) {}
}

function _applyToDOM({ theme, accentColor, density }) {
  const root = document.documentElement;

  // ── Accent color ──
  if (accentColor) {
    // Derive a dimmed version (12% opacity) for backgrounds
    const hex = accentColor.replace('#','');
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    root.style.setProperty('--accent',       accentColor);
    root.style.setProperty('--accent-dim',   `rgba(${r},${g},${b},.12)`);
    root.style.setProperty('--accent-glow',  `rgba(${r},${g},${b},.06)`);
  }

  // ── Theme ──
  const effectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : (theme || 'dark');

  if (effectiveTheme === 'light') {
    root.style.setProperty('--bg',       '#f0f2f5');
    root.style.setProperty('--surface',  '#ffffff');
    root.style.setProperty('--surface2', '#f8fafc');
    root.style.setProperty('--border',   '#e2e8f0');
    root.style.setProperty('--border2',  '#cbd5e1');
    root.style.setProperty('--text',     '#0f172a');
    root.style.setProperty('--muted',    '#64748b');
    root.style.setProperty('--faint',    '#94a3b8');
  } else {
    root.style.setProperty('--bg',       '#080b10');
    root.style.setProperty('--surface',  '#0e1219');
    root.style.setProperty('--surface2', '#141922');
    root.style.setProperty('--border',   '#1e2535');
    root.style.setProperty('--border2',  '#2a3347');
    root.style.setProperty('--text',     '#e2e8f0');
    root.style.setProperty('--muted',    '#64748b');
    root.style.setProperty('--faint',    '#374151');
  }

  // ── Density ──
  const spacingMap = { compact: '20px 22px', comfortable: '26px 28px', spacious: '32px 34px' };
  const mainPadMap = { compact: '16px 20px 32px', comfortable: '24px 28px 40px', spacious: '32px 36px 56px' };
  const gapMap     = { compact: '12px', comfortable: '20px', spacious: '28px' };
  if (density) {
    root.style.setProperty('--density-padding', spacingMap[density] || spacingMap.comfortable);
    root.style.setProperty('--density-main-pad', mainPadMap[density] || mainPadMap.comfortable);
    root.style.setProperty('--density-gap', gapMap[density] || gapMap.comfortable);
    // Apply to in-main directly if present
    document.querySelectorAll('.in-main, .sb-main').forEach(el => {
      el.style.padding = mainPadMap[density];
    });
  }
}

async function _saveAppearance(uid, patch) {
  // Write CSS vars + localStorage immediately (instant across-page effect)
  const current = (() => { try { return JSON.parse(localStorage.getItem('tf_appearance') || '{}'); } catch { return {}; } })();
  const next = { ...current, ...patch };
  localStorage.setItem('tf_appearance', JSON.stringify(next));
  _applyToDOM(next);

  // Persist to Supabase in background
  if (!uid) return;
  await supabase.from('user_settings').upsert(
    { user_id: uid, ...patch, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

function AppearancePanel({ settings = {} }) {
  const [theme,       setThemeState]  = useState(settings.theme        || 'dark');
  const [density,     setDensityState]= useState(settings.layout_density || 'comfortable');
  const [accentColor, setAccentState] = useState(settings.accent_color || '#c8f560');
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const uidRef = React.useRef(null);

  // Grab user id once on mount
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { uidRef.current = data?.user?.id || null; });
    // Also apply whatever is already in localStorage immediately
    applyAppearance();
  }, []);

  const persist = async (patch) => {
    setSaving(true); setSaved(false);
    await _saveAppearance(uidRef.current, patch);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const changeTheme = (t) => { setThemeState(t); persist({ theme: t }); };
  const changeAccent = (c) => { setAccentState(c); persist({ accent_color: c }); };
  const changeDensity = (d) => { setDensityState(d); persist({ layout_density: d }); };

  const accents = ['#c8f560','#60a5fa','#a78bfa','#34d399','#f59e0b','#f87171'];

  return (
    <div className="st-panel">

      {/* Save status bar */}
      {(saving || saved) && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
          background: saved ? 'rgba(52,211,153,.08)' : 'rgba(200,245,96,.06)',
          border: `1px solid ${saved ? 'rgba(52,211,153,.2)' : 'rgba(200,245,96,.15)'}`,
          borderRadius:'var(--r-sm)', fontSize:12 }}>
          {saving
            ? <><i className="ti ti-loader-2" style={{ color:T.g, fontSize:14 }} /> Saving…</>
            : <><i className="ti ti-circle-check" style={{ color:T.gn, fontSize:14 }} /> Applied to all pages</>}
        </div>
      )}

      {/* Theme */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-sun" />Theme</div>
          <div className="st-card-desc">Choose your interface appearance.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { key:'dark',   icon:'ti-moon',           label:'Dark'   },
              { key:'light',  icon:'ti-sun',            label:'Light'  },
              { key:'system', icon:'ti-device-desktop', label:'System' },
            ].map(t => (
              <button key={t.key} onClick={() => changeTheme(t.key)} style={{
                background: theme === t.key ? T.gd : T.s2,
                border: `1px solid ${theme === t.key ? 'rgba(200,245,96,.3)' : T.br}`,
                borderRadius:12, padding:'14px 10px', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                transition:'all .15s',
              }}>
                <i className={`ti ${t.icon}`} style={{ fontSize:22, color: theme === t.key ? T.g : T.nt }} />
                <span style={{ fontSize:12, fontWeight:600, color: theme === t.key ? T.g : T.gr }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-palette" />Accent Color</div>
          <div className="st-card-desc">Personalise your highlight color. Changes apply across all pages instantly.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {accents.map(c => (
              <button key={c} onClick={() => changeAccent(c)} style={{
                width:34, height:34, borderRadius:'50%', background:c, border:'none',
                cursor:'pointer',
                outline: accentColor === c ? `3px solid ${c}` : 'none',
                outlineOffset:3, transition:'outline .15s',
                boxShadow: accentColor === c ? `0 0 12px ${c}55` : 'none',
              }} />
            ))}
          </div>
          <div style={{ fontSize:11, color:T.nt, marginTop:4, display:'flex', alignItems:'center', gap:5 }}>
            <i className="ti ti-info-circle" style={{ fontSize:12 }} />
            Selected: <span style={{ fontFamily:T.mono, color:accentColor }}>{accentColor}</span>
          </div>
        </div>
      </div>

      {/* Layout Density */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-layout" />Layout Density</div>
          <div className="st-card-desc">Control spacing throughout the interface.</div>
        </div>
        <div className="st-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[
              { key:'compact',     label:'Compact',     sub:'Tighter spacing' },
              { key:'comfortable', label:'Comfortable', sub:'Default' },
              { key:'spacious',    label:'Spacious',    sub:'More breathing room' },
            ].map(d => (
              <button key={d.key} onClick={() => changeDensity(d.key)} style={{
                background: density === d.key ? T.gd : T.s2,
                border: `1px solid ${density === d.key ? 'rgba(200,245,96,.3)' : T.br}`,
                borderRadius:10, padding:'12px', cursor:'pointer', textAlign:'left', transition:'all .15s',
              }}>
                <div style={{ fontSize:12, fontWeight:700, color: density === d.key ? T.g : T.gr, marginBottom:4 }}>{d.label}</div>
                <div style={{ fontSize:10, color:T.nt }}>{d.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Language Panel ──────────────────────────────────── */
const LANGUAGES = [
  // Major world languages
  { code:'en',    name:'English',              native:'English',              flag:'🇬🇧', region:'Global' },
  { code:'en-US', name:'English (US)',         native:'English (US)',         flag:'🇺🇸', region:'Global' },
  { code:'zh',    name:'Chinese (Simplified)', native:'中文（简体）',          flag:'🇨🇳', region:'Asia' },
  { code:'zh-TW', name:'Chinese (Traditional)',native:'中文（繁體）',          flag:'🇹🇼', region:'Asia' },
  { code:'hi',    name:'Hindi',                native:'हिन्दी',               flag:'🇮🇳', region:'Asia' },
  { code:'es',    name:'Spanish',              native:'Español',              flag:'🇪🇸', region:'Europe' },
  { code:'es-419',name:'Spanish (Latin America)',native:'Español (Latam)',    flag:'🌎', region:'Americas' },
  { code:'fr',    name:'French',               native:'Français',             flag:'🇫🇷', region:'Europe' },
  { code:'ar',    name:'Arabic',               native:'العربية',              flag:'🇸🇦', region:'Middle East', rtl: true },
  { code:'bn',    name:'Bengali',              native:'বাংলা',                flag:'🇧🇩', region:'Asia' },
  { code:'pt',    name:'Portuguese',           native:'Português',            flag:'🇵🇹', region:'Europe' },
  { code:'pt-BR', name:'Portuguese (Brazil)',  native:'Português (Brasil)',    flag:'🇧🇷', region:'Americas' },
  { code:'ru',    name:'Russian',              native:'Русский',              flag:'🇷🇺', region:'Europe' },
  { code:'ja',    name:'Japanese',             native:'日本語',               flag:'🇯🇵', region:'Asia' },
  { code:'pa',    name:'Punjabi',              native:'ਪੰਜਾਬੀ',              flag:'🇮🇳', region:'Asia' },
  { code:'de',    name:'German',               native:'Deutsch',              flag:'🇩🇪', region:'Europe' },
  { code:'ko',    name:'Korean',               native:'한국어',               flag:'🇰🇷', region:'Asia' },
  { code:'vi',    name:'Vietnamese',           native:'Tiếng Việt',           flag:'🇻🇳', region:'Asia' },
  { code:'tr',    name:'Turkish',              native:'Türkçe',               flag:'🇹🇷', region:'Europe' },
  { code:'it',    name:'Italian',              native:'Italiano',             flag:'🇮🇹', region:'Europe' },
  { code:'fa',    name:'Persian',              native:'فارسی',                flag:'🇮🇷', region:'Middle East', rtl: true },
  { code:'pl',    name:'Polish',               native:'Polski',               flag:'🇵🇱', region:'Europe' },
  { code:'uk',    name:'Ukrainian',            native:'Українська',           flag:'🇺🇦', region:'Europe' },
  { code:'nl',    name:'Dutch',                native:'Nederlands',           flag:'🇳🇱', region:'Europe' },
  { code:'ms',    name:'Malay',                native:'Bahasa Melayu',        flag:'🇲🇾', region:'Asia' },
  { code:'id',    name:'Indonesian',           native:'Bahasa Indonesia',     flag:'🇮🇩', region:'Asia' },
  { code:'th',    name:'Thai',                 native:'ไทย',                  flag:'🇹🇭', region:'Asia' },
  { code:'sv',    name:'Swedish',              native:'Svenska',              flag:'🇸🇪', region:'Europe' },
  { code:'no',    name:'Norwegian',            native:'Norsk',                flag:'🇳🇴', region:'Europe' },
  { code:'da',    name:'Danish',               native:'Dansk',                flag:'🇩🇰', region:'Europe' },
  { code:'fi',    name:'Finnish',              native:'Suomi',                flag:'🇫🇮', region:'Europe' },
  { code:'cs',    name:'Czech',                native:'Čeština',              flag:'🇨🇿', region:'Europe' },
  { code:'ro',    name:'Romanian',             native:'Română',               flag:'🇷🇴', region:'Europe' },
  { code:'hu',    name:'Hungarian',            native:'Magyar',               flag:'🇭🇺', region:'Europe' },
  { code:'el',    name:'Greek',                native:'Ελληνικά',             flag:'🇬🇷', region:'Europe' },
  { code:'he',    name:'Hebrew',               native:'עברית',                flag:'🇮🇱', region:'Middle East', rtl: true },
  { code:'sw',    name:'Swahili',              native:'Kiswahili',            flag:'🇰🇪', region:'Africa' },
  { code:'yo',    name:'Yoruba',               native:'Yorùbá',               flag:'🇳🇬', region:'Africa' },
  { code:'ha',    name:'Hausa',                native:'Hausa',                flag:'🇳🇬', region:'Africa' },
  { code:'ig',    name:'Igbo',                 native:'Igbo',                 flag:'🇳🇬', region:'Africa' },
  { code:'am',    name:'Amharic',              native:'አማርኛ',                flag:'🇪🇹', region:'Africa' },
  { code:'af',    name:'Afrikaans',            native:'Afrikaans',            flag:'🇿🇦', region:'Africa' },
];

const REGIONS = ['Global', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa'];

function LanguagePanel({ language: initialLanguage = 'en' }) {
  const [selected,  setSelected]  = useState(initialLanguage);
  const [search,    setSearch]    = useState('');
  const [region,    setRegion]    = useState('All');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  // Keep in sync if prop updates (e.g. after data re-fetch)
  React.useEffect(() => {
    if (initialLanguage) setSelected(initialLanguage);
  }, [initialLanguage]);

  const filtered = LANGUAGES.filter(l => {
    const matchRegion = region === 'All' || l.region === region;
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  const currentLang = LANGUAGES.find(l => l.code === selected) || LANGUAGES[0];

  async function save() {
    setSaving(true); setSaved(false); setError('');
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');
      const { error: err } = await supabase
        .from('user_settings')
        .update({ language: selected })
        .eq('user_id', authUser.id);
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message || 'Failed to save language');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="st-panel">

      {/* Status bar */}
      {(saving || saved || error) && (
        <div style={{
          display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
          background: error ? 'rgba(248,113,113,.08)' : saved ? 'rgba(52,211,153,.08)' : 'rgba(200,245,96,.06)',
          border: `1px solid ${error ? 'rgba(248,113,113,.2)' : saved ? 'rgba(52,211,153,.2)' : 'rgba(200,245,96,.15)'}`,
          borderRadius:'var(--r-sm)', fontSize:12,
        }}>
          {error
            ? <><i className="ti ti-alert-circle" style={{ color:T.rd, fontSize:14 }} /> {error}</>
            : saving
              ? <><i className="ti ti-loader-2" style={{ color:T.g, fontSize:14 }} /> Saving language preference…</>
              : <><i className="ti ti-circle-check" style={{ color:T.gn, fontSize:14 }} /> Language saved — will apply across all pages</>}
        </div>
      )}

      {/* Current selection hero */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-language" />Display Language</div>
          <div className="st-card-desc">Choose the language used across the entire TradeFlow platform.</div>
        </div>
        <div className="st-card-body">
          {/* Current language hero */}
          <div style={{
            display:'flex', alignItems:'center', gap:16, padding:'14px 18px',
            background:'var(--accent-dim)', border:'1px solid rgba(200,245,96,.2)',
            borderRadius:'var(--r-md)',
          }}>
            <div style={{ fontSize:36, lineHeight:1, flexShrink:0 }}>{currentLang.flag}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:2 }}>
                {currentLang.name}
              </div>
              <div style={{ fontSize:13, color:'var(--muted)', fontFamily:T.mono }}>{currentLang.native}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
              <span style={{ fontSize:10, fontWeight:700, background:'var(--accent)', color:'#000', padding:'2px 8px', borderRadius:4 }}>
                ACTIVE
              </span>
              {currentLang.rtl && (
                <span style={{ fontSize:10, fontWeight:700, background:'var(--amber-dim)', color:'var(--amber)', padding:'2px 8px', borderRadius:4 }}>
                  RTL
                </span>
              )}
            </div>
          </div>

          {/* Search + region filter */}
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ position:'relative', flex:1 }}>
              <i className="ti ti-search" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'var(--muted)', pointerEvents:'none' }} />
              <input
                className="st-input"
                style={{ paddingLeft:32 }}
                placeholder="Search language or code…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="st-select"
              value={region}
              onChange={e => setRegion(e.target.value)}
              style={{ minWidth:140 }}
            >
              <option value="All">All Regions</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Language grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:8, maxHeight:380, overflowY:'auto', paddingRight:4 }}>
            {filtered.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13 }}>
                <i className="ti ti-search-off" style={{ fontSize:24, display:'block', marginBottom:8 }} />
                No languages match "{search}"
              </div>
            )}
            {filtered.map(l => {
              const isActive = l.code === selected;
              return (
                <button
                  key={l.code}
                  onClick={() => setSelected(l.code)}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'10px 12px', borderRadius:'var(--r-sm)', cursor:'pointer',
                    background: isActive ? 'var(--accent-dim)' : 'var(--surface2)',
                    border: `1px solid ${isActive ? 'rgba(200,245,96,.35)' : 'var(--border)'}`,
                    transition:'all .15s', textAlign:'left',
                  }}
                >
                  <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>{l.flag}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color: isActive ? 'var(--accent)' : 'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {l.name}
                    </div>
                    <div style={{ fontSize:10, color:'var(--muted)', marginTop:1 }}>{l.native}</div>
                  </div>
                  {isActive && <i className="ti ti-check" style={{ fontSize:14, color:'var(--accent)', flexShrink:0 }} />}
                  {l.rtl && !isActive && <span style={{ fontSize:8, fontWeight:700, background:'var(--amber-dim)', color:'var(--amber)', padding:'1px 5px', borderRadius:3, flexShrink:0 }}>RTL</span>}
                </button>
              );
            })}
          </div>

          {/* Footer: count + save */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:4 }}>
            <div style={{ fontSize:11, color:'var(--muted)' }}>
              {filtered.length} of {LANGUAGES.length} languages shown
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="in-btn in-btn-ghost in-btn-sm" onClick={() => { setSelected('en'); setSearch(''); setRegion('All'); }}>
                Reset to English
              </button>
              <button
                className="in-btn in-btn-accent in-btn-sm"
                onClick={save}
                disabled={saving}
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                {saving
                  ? <><i className="ti ti-loader-2" /> Saving…</>
                  : <><i className="ti ti-check" /> Save Language</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-info-circle" />About Language Settings</div>
          <div className="st-card-desc">What changes when you switch language.</div>
        </div>
        <div className="st-card-body">
          {[
            { icon:'ti-layout-dashboard', label:'Interface Labels',     sub:'All menus, buttons, and navigation labels will appear in your chosen language.' },
            { icon:'ti-bell',             label:'Notifications',        sub:'System alerts and notification messages will be translated where available.' },
            { icon:'ti-calendar',         label:'Date & Time Formats',  sub:'Dates, times, and numbers will follow the conventions of your selected locale.' },
            { icon:'ti-chart-candle',     label:'Market Data',          sub:'Asset names and market labels follow your region\'s standard naming conventions.' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <div className="st-divider" />}
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:'var(--accent)', flexShrink:0 }}>
                  <i className={`ti ${item.icon}`} />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{item.label}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.5 }}>{item.sub}</div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}

function PrivacyPanel({ settings = {} }) {
  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-eye" />Profile Visibility</div>
          <div className="st-card-desc">Control what others can see on your profile.</div>
        </div>
        <div className="st-card-body">
          {[
            { label:'Public Profile',        sub:'Your profile is visible to all users',                def: settings.profile_public         ?? true  },
            { label:'Show Watchlist',         sub:'Let others see your saved assets',                    def: settings.show_watchlist          ?? false },
            { label:'Show Activity Feed',     sub:'Display your recent activity on your profile',        def: settings.show_activity           ?? true  },
            { label:'Show Followed Traders',  sub:'Let others see the traders you follow',              def: settings.show_followed_traders   ?? false },
            { label:'Appear in Search',       sub:'Show up in user search results',                      def: settings.appear_in_search        ?? true  },
          ].map((r, i) => (
            <React.Fragment key={r.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div className="st-row-info">
                  <div className="st-row-label">{r.label}</div>
                  <div className="st-row-sub">{r.sub}</div>
                </div>
                <Toggle defaultChecked={r.def} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-chart-dots" />Data & Analytics</div>
          <div className="st-card-desc">How your data is used to improve the platform.</div>
        </div>
        <div className="st-card-body">
          {[
            { label:'Usage Analytics',     sub:'Share anonymised usage data to improve the product',         def: settings.usage_analytics    ?? true  },
            { label:'Personalised Feed',   sub:'Use your activity to personalise signal recommendations',   def: settings.personalised_feed  ?? true  },
            { label:'Marketing Emails',    sub:'Receive product news and feature announcements',             def: settings.marketing_emails   ?? false },
          ].map((r, i) => (
            <React.Fragment key={r.label}>
              {i > 0 && <div className="st-divider" />}
              <div className="st-row">
                <div className="st-row-info">
                  <div className="st-row-label">{r.label}</div>
                  <div className="st-row-sub">{r.sub}</div>
                </div>
                <Toggle defaultChecked={r.def} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-database" />Your Data</div>
          <div className="st-card-desc">Download or delete your personal data.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {[
            { icon:'ti-download', label:'Download Your Data',    sub:'Export all your account data as a ZIP file',      btn:'Request Export', btnClass:'in-btn-ghost' },
            { icon:'ti-trash',    label:'Delete Account',        sub:'Permanently delete your account and all data',    btn:'Delete Account', btnClass:'in-btn-danger' },
          ].map((r, i) => (
            <div key={i} className="st-danger-row">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:T.s2, border:`1px solid ${T.br}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:T.nt }}>
                  <i className={`ti ${r.icon}`} />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:11, color:T.nt }}>{r.sub}</div>
                </div>
              </div>
              <button className={`in-btn ${r.btnClass} in-btn-sm`}>{r.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConnectedPanel({ apps = [] }) {
  const APP_CONFIG = [
    { key:'discord',     icon:'ti-brand-discord',  label:'Discord',     sub:'Get alerts in your Discord server',       iconBg:'rgba(96,165,250,.12)',  iconCol:'#60a5fa' },
    { key:'telegram',    icon:'ti-brand-telegram', label:'Telegram',    sub:'Receive signals via Telegram bot',         iconBg:'rgba(52,211,153,.12)',  iconCol:'#34d399' },
    { key:'broker_link', icon:'ti-building-bank',  label:'Broker Link', sub:'Connect a paper trading or live broker',   iconBg:'rgba(245,158,11,.12)',  iconCol:'#f59e0b' },
  ];

  const [states, setStates] = useState(() =>
    Object.fromEntries(APP_CONFIG.map(({ key }) => {
      const row = apps.find(a => a.app_name === key);
      return [key, { connected: row?.is_connected || false, loading: false }];
    }))
  );

  async function toggle(key, currentlyConnected) {
    setStates(s => ({ ...s, [key]: { ...s[key], loading: true } }));
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const uid = authUser?.id;
      if (!uid) throw new Error('Not authenticated');

      // Upsert into connected_apps
      const { error } = await supabase.from('connected_apps').upsert({
        user_id:      uid,
        app_name:     key,
        is_connected: !currentlyConnected,
        connected_at:  !currentlyConnected ? new Date().toISOString() : null,
        disconnected_at: currentlyConnected ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,app_name' });

      if (error) throw error;
      setStates(s => ({ ...s, [key]: { connected: !currentlyConnected, loading: false } }));
    } catch (e) {
      console.error('Toggle failed:', e.message);
      setStates(s => ({ ...s, [key]: { ...s[key], loading: false } }));
    }
  }

  return (
    <div className="st-panel">
      <div className="st-card">
        <div className="st-card-head">
          <div className="st-card-title"><i className="ti ti-plug" />Connected Apps</div>
          <div className="st-card-desc">Third-party integrations linked to your account.</div>
        </div>
        <div className="st-card-body" style={{ gap:0 }}>
          {APP_CONFIG.map((a, i) => {
            const { connected, loading } = states[a.key];
            return (
              <div key={a.key} className="st-conn">
                <div className="st-conn-icon" style={{ background:a.iconBg, color:a.iconCol }}>
                  <i className={`ti ${a.icon}`} />
                </div>
                <div style={{ flex:1 }}>
                  <div className="st-conn-name" style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {a.label}
                    {connected && <span className="in-badge in-badge-green">Connected</span>}
                  </div>
                  <div className="st-conn-sub">{a.sub}</div>
                </div>
                <button
                  className={`in-btn ${connected ? 'in-btn-ghost' : 'in-btn-accent'} in-btn-sm`}
                  disabled={loading}
                  onClick={() => toggle(a.key, connected)}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? '…' : connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar & Topbar ──────────────────────────────── */
function Sidebar({ open, user = {}, sub, wallet, copyCount = 0 }) {
  const { t } = useTranslation();
  const plan      = sub?.subscription_plans;
  const ini       = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  const fullName  = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Loading…';
  const planLabel = plan ? `${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} Member` : 'Basic Plan';
  const portfolioVal = fmtMoney(wallet?.balance ?? 0, wallet?.currency || user.currency || 'USD');
  const NAV = [
    { section: t('navMarkets') },
    { href:'/dashboard',    icon:'ti-layout-dashboard',  label: t('navDashboard') },
    { href:'/terminal',     icon:'ti-chart-candlestick', label: t('navTrading') },
    { href:'/insights',     icon:'ti-bulb',              label: t('navInsights') },
    { section: t('navSocial') },
    { href:'/copy-trading', icon:'ti-users',             label: t('navCopyTrading'), badge: copyCount || null },
    { href:'/profile',      icon:'ti-user-circle',       label: t('navProfile') },
    { href:'/market-place', icon:'ti-world',             label: t('navMarketplace') },
    { section: t('navAccount') },
    { href:'/settings',     icon:'ti-settings',          label: t('navLanguage').includes('Language') ? 'Settings' : t('navAccount'), active:true },
    { href:'/support',      icon:'ti-help-circle',       label: t('navSupport') },
  ];
  // Fix: use static key for settings label
  const NAV_ITEMS = [
    { section: t('navMarkets') },
    { href:'/dashboard',    icon:'ti-layout-dashboard',  label: t('navDashboard') },
    { href:'/terminal',     icon:'ti-chart-candlestick', label: t('navTrading') },
    { href:'/insights',     icon:'ti-bulb',              label: t('navInsights') },
    { section: t('navSocial') },
    { href:'/copy-trading', icon:'ti-users',             label: t('navCopyTrading'), badge: copyCount || null },
    { href:'/profile',      icon:'ti-user-circle',       label: t('navProfile') },
    { href:'/market-place', icon:'ti-world',             label: t('navMarketplace') },
    { section: t('navAccount') },
    { href:'/settings',     icon:'ti-settings',          label: t('navLanguage'), active:true },
    { href:'/support',      icon:'ti-help-circle',       label: t('navSupport') },
  ];
  return (
    <aside className={`in-sidebar${open ? ' open' : ''}`}>
      <div className="in-brand">
        <div className="in-brand-icon"><i className="ti ti-wave-sine" /></div>
        <div className="in-brand-name">Trade<em>Flow</em></div>
      </div>
      <div className="in-sb-pill">
        <div className="in-sb-pill-label"><span className="in-live-dot" />{t('portfolioValue')}</div>
        <div className="in-sb-pill-val">{portfolioVal}</div>
        <div className="in-sb-pill-sub">{t('liveFromWallet')}</div>
      </div>
      <div className="in-sb-scroll">
        {NAV_ITEMS.map((n, i) => n.section
          ? <div key={i} className="in-sb-section">{n.section}</div>
          : (
            <a key={i} className={`in-sb-link${n.active ? ' active' : ''}`} href={n.href}>
              <i className={`ti ${n.icon}`} />{n.label}
              {n.badge && <span className="in-sb-badge">{n.badge}</span>}
            </a>
          )
        )}
      </div>
      <div className="in-sb-user">
        <div className="in-sb-avatar">{ini}</div>
        <div>
          <div className="in-sb-user-name">{fullName}</div>
          <div className="in-sb-user-role">{planLabel}</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenu, user = {}, unreadCount = 0 }) {
  const { t } = useTranslation();
  const ini = initials(`${user.first_name || ''} ${user.last_name || ''}`);
  return (
    <header className="in-topbar">
      <div className="in-hamburger" onClick={onMenu}><span /><span /><span /></div>
      <div className="in-topbar-title">{t('accountSettings')} <span>{t('settingsHighlight')}</span></div>
      <div className="in-tb-icon"><i className="ti ti-search" /></div>
      <div className="in-tb-icon"><a href='/notification'>
        <i className="ti ti-bell" />
        {unreadCount > 0 && <span className="in-notif-dot" />}</a>
      </div>
      <div className="in-tb-avatar">{ini || '?'}</div>
    </header>
  );
}

/* ─── Root ───────────────────────────────────────────── */
export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('tf_language') || 'en'; } catch { return 'en'; }
  });

  const t = React.useCallback((key, ...args) => {
    const tr = getTranslations(language);
    const val = tr[key] ?? TRANSLATIONS['en'][key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
  }, [language]);

  const handleSetLanguage = React.useCallback((lang) => {
    setLanguage(lang);
    try { localStorage.setItem('tf_language', lang); } catch {}
    // Apply RTL if needed
    const langDef = LANGUAGES.find(l => l.code === lang);
    document.documentElement.dir = langDef?.rtl ? 'rtl' : 'ltr';
  }, []);

  // Apply saved appearance settings on mount (accent, theme, density)
  React.useEffect(() => {
    applyAppearance();
    // Apply saved language direction on mount
    const langDef = LANGUAGES.find(l => l.code === language);
    document.documentElement.dir = langDef?.rtl ? 'rtl' : 'ltr';
  }, []);

  const { data, loading, error } = useSettingsData();

  const user     = data?.user         || {};
  const sub      = data?.subscription;
  const settings = data?.settings     || {};

  const panels = {
    profile:       <ProfilePanel user={user} />,
    security:      <SecurityPanel twoFa={data?.twoFa || []} sessions={data?.sessions || []} />,
    subscription:  <SubscriptionPanel subscription={sub} usage={data?.usage} />,
    notifications: <NotificationsPanel />,
    appearance:    <AppearancePanel settings={settings} />,
    language:      <LanguagePanel language={language} onLanguageChange={handleSetLanguage} />,
    privacy:       <PrivacyPanel settings={settings} />,
    connected:     <ConnectedPanel apps={data?.apps || []} />,
  };

  if (loading) return (
    <LanguageContext.Provider value={{ t, language, setLanguage: handleSetLanguage }}>
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16 }}>
          <div style={{ width:40, height:40, border:'3px solid rgba(200,245,96,.2)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          <div style={{ color:'var(--muted)', fontSize:13 }}>{t('loadingSettings')}</div>
          <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
        </div>
      </>
    </LanguageContext.Provider>
  );

  if (error) return (
    <LanguageContext.Provider value={{ t, language, setLanguage: handleSetLanguage }}>
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:12 }}>
          <i className="ti ti-alert-circle" style={{ fontSize:32, color:'var(--red)' }} />
          <div style={{ color:'var(--text)', fontWeight:600 }}>{t('failedSettings')}</div>
          <div style={{ color:'var(--muted)', fontSize:12 }}>{error}</div>
        </div>
      </>
    </LanguageContext.Provider>
  );

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage: handleSetLanguage }}>
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {/* Per-user theme / density / accent overrides from user_settings */}
        <style dangerouslySetInnerHTML={{ __html: `:root { ${buildThemeVars(settings)} }` }} />

        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:299,
          }} />
        )}

        <div className="in-shell">
          <Sidebar open={sidebarOpen} user={user} sub={sub} wallet={data?.wallet} copyCount={data?.copyCount || 0} />

          <div className="in-right">
            <Topbar onMenu={() => setSidebarOpen(v => !v)} user={user} unreadCount={data?.unreadCount || 0} />

            <main className="in-main">
              <div className="st-layout">

                {/* Settings nav */}
                <nav className="st-nav">
                  {NAV_SECTIONS.map(s => (
                    <React.Fragment key={s.labelKey}>
                      <div className="st-nav-section">{t(s.labelKey)}</div>
                      {s.items.map(item => (
                        <button
                          key={item.key}
                          className={`st-nav-link${activeSection === item.key ? ' active' : ''}`}
                          onClick={() => setActiveSection(item.key)}
                        >
                          <i className={`ti ${item.icon}`} />
                          {t(item.labelKey)}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </nav>

                {/* Active panel */}
                <div>
                  {panels[activeSection]}
                </div>

              </div>
            </main>
          </div>
        </div>
      </>
    </LanguageContext.Provider>
  );
}