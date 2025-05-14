
import React, { createContext, useContext, useState, useEffect } from 'react';

type TranslationKey = 
  | 'welcome'
  | 'settings'
  | 'logout'
  | 'recentPhotos'
  | 'selectDayToSeeDetails'
  | 'editPhoto'
  | 'addPhoto'
  | 'title'
  | 'enterTitle'
  | 'description'
  | 'enterDescription'
  | 'image'
  | 'uploadFromDevice'
  | 'orUseUrl'
  | 'enterImageUrl'
  | 'cancel'
  | 'updatePhoto'
  | 'savePhoto'
  | 'sendMatchRequest'
  | 'matchRequestReceived'
  | 'partnerEmail'
  | 'matchRequestExplanation'
  | 'matchRequestFrom'
  | 'setRelationshipStartDate'
  | 'selectDate'
  | 'matchDateExplanation'
  | 'sendRequest'
  | 'decline'
  | 'accept'
  | 'pendingRequests'
  | 'emailRequired'
  | 'invalidEmail'
  | 'cannotMatchSelf'
  | 'startDateRequired'
  | 'requestAccepted'
  | 'requestDeclined'
  | 'errorAcceptingRequest'
  | 'errorDecliningRequest'
  | 'titleRequired'
  | 'imageRequired'
  | 'photoUpdated'
  | 'photoAdded'
  | 'errorSavingPhoto'
  | 'userNotFound'
  | 'invalidPassword'
  | 'loginSuccess'
  | 'loginError'
  | 'passwordMismatch'
  | 'emailExists'
  | 'registrationSuccess'
  | 'registrationError'
  | 'photoAlbum'
  | 'noPhotos'
  | 'events'
  | 'photos'
  | 'addEvent'
  | 'noEventsForThisDay'
  | 'noPhotosForThisDay'
  | 'editEvent'
  | 'createEvent'
  | 'addMoment'
  | 'createNewEvent'
  | 'eventPlaceholder'
  | 'descriptionPlaceholder'
  | 'date'
  | 'time'
  | 'location'
  | 'locationPlaceholder'
  | 'eventDeleted'
  | 'delete'
  | 'update'
  | 'create'
  | 'event';

type Translations = {
  [key in TranslationKey]: string;
};

type Languages = 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Languages;
  setLanguage: (lang: Languages) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Languages, Translations> = {
  en: {
    welcome: 'Welcome to your Love Journey',
    settings: 'Settings',
    logout: 'Logout',
    recentPhotos: 'Recent Photos',
    selectDayToSeeDetails: 'Select a day to see details',
    editPhoto: 'Edit Photo',
    addPhoto: 'Add Photo',
    title: 'Title',
    enterTitle: 'Enter a title',
    description: 'Description',
    enterDescription: 'Enter a description',
    image: 'Image',
    uploadFromDevice: 'Upload from device',
    orUseUrl: 'Or use URL',
    enterImageUrl: 'Enter image URL',
    cancel: 'Cancel',
    updatePhoto: 'Update Photo',
    savePhoto: 'Save Photo',
    sendMatchRequest: 'Send Match Request',
    matchRequestReceived: 'Match Request Received',
    partnerEmail: 'Partner\'s Email',
    matchRequestExplanation: 'Send a match request to your partner. They will receive an email to accept the match.',
    matchRequestFrom: 'Match Request From',
    setRelationshipStartDate: 'Set Relationship Start Date',
    selectDate: 'Select Date',
    matchDateExplanation: 'This will be used as your anniversary date.',
    sendRequest: 'Send Request',
    decline: 'Decline',
    accept: 'Accept',
    pendingRequests: 'Pending Requests',
    emailRequired: 'Email is required',
    invalidEmail: 'Please enter a valid email',
    cannotMatchSelf: 'You cannot match with yourself',
    startDateRequired: 'Start date is required',
    requestAccepted: 'Match request accepted!',
    requestDeclined: 'Match request declined',
    errorAcceptingRequest: 'Error accepting request',
    errorDecliningRequest: 'Error declining request',
    titleRequired: 'Title is required',
    imageRequired: 'Image is required',
    photoUpdated: 'Photo updated successfully',
    photoAdded: 'Photo added successfully',
    errorSavingPhoto: 'Error saving photo',
    userNotFound: 'User not found',
    invalidPassword: 'Invalid password',
    loginSuccess: 'Login successful!',
    loginError: 'Error logging in',
    passwordMismatch: 'Passwords do not match',
    emailExists: 'Email already exists',
    registrationSuccess: 'Registration successful!',
    registrationError: 'Error registering',
    photoAlbum: 'Photo Album',
    noPhotos: 'No photos yet. Add your first memory!',
    events: 'Events',
    photos: 'Photos',
    addEvent: 'Add Event',
    noEventsForThisDay: 'No events for this day',
    noPhotosForThisDay: 'No photos for this day',
    editEvent: 'Edit Event',
    createEvent: 'Create Event',
    addMoment: 'Add a moment',
    createNewEvent: 'Create New Event',
    eventPlaceholder: 'Enter event title',
    descriptionPlaceholder: 'Enter event description',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    locationPlaceholder: 'Enter location',
    eventDeleted: 'Event deleted successfully',
    delete: 'Delete',
    update: 'Update',
    create: 'Create',
    event: 'event'
  },
  
  es: {
    welcome: 'Bienvenido a tu viaje de amor',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    recentPhotos: 'Fotos recientes',
    selectDayToSeeDetails: 'Selecciona un día para ver detalles',
    editPhoto: 'Editar foto',
    addPhoto: 'Añadir nueva foto',
    title: 'Título',
    enterTitle: 'Ingrese título',
    description: 'Descripción',
    enterDescription: 'Ingrese descripción',
    image: 'Imagen',
    uploadFromDevice: 'Subir desde dispositivo',
    orUseUrl: 'O usar URL',
    enterImageUrl: 'Ingrese URL de imagen',
    cancel: 'Cancelar',
    updatePhoto: 'Actualizar foto',
    savePhoto: 'Guardar foto',
    sendMatchRequest: 'Enviar Solicitud de Pareja',
    matchRequestReceived: 'Solicitud de Pareja Recibida',
    partnerEmail: 'Email de tu Pareja',
    matchRequestExplanation: 'Envía una solicitud de pareja. Ellos recibirán un email para aceptar.',
    matchRequestFrom: 'Solicitud de',
    setRelationshipStartDate: 'Fecha de Inicio de Relación',
    selectDate: 'Seleccionar Fecha',
    matchDateExplanation: 'Esta fecha se usará como fecha de aniversario.',
    sendRequest: 'Enviar Solicitud',
    decline: 'Rechazar',
    accept: 'Aceptar',
    pendingRequests: 'Solicitudes Pendientes',
    emailRequired: 'El email es requerido',
    invalidEmail: 'Ingresa un email válido',
    cannotMatchSelf: 'No puedes emparejarte contigo mismo',
    startDateRequired: 'La fecha de inicio es requerida',
    requestAccepted: '¡Solicitud aceptada!',
    requestDeclined: 'Solicitud rechazada',
    errorAcceptingRequest: 'Error al aceptar la solicitud',
    errorDecliningRequest: 'Error al rechazar la solicitud',
    titleRequired: 'El título es requerido',
    imageRequired: 'La imagen es requerida',
    photoUpdated: 'Foto actualizada exitosamente',
    photoAdded: 'Foto añadida exitosamente',
    errorSavingPhoto: 'Error al guardar la foto',
    userNotFound: 'Usuario no encontrado',
    invalidPassword: 'Contraseña inválida',
    loginSuccess: '¡Inicio de sesión exitoso!',
    loginError: 'Error al iniciar sesión',
    passwordMismatch: 'Las contraseñas no coinciden',
    emailExists: 'El email ya existe',
    registrationSuccess: '¡Registro exitoso!',
    registrationError: 'Error al registrarse',
    photoAlbum: 'Álbum de fotos',
    noPhotos: 'Aún no hay fotos. ¡Añade tu primer recuerdo!',
    events: 'Eventos',
    photos: 'Fotos',
    addEvent: 'Añadir Evento',
    noEventsForThisDay: 'No hay eventos para este día',
    noPhotosForThisDay: 'No hay fotos para este día',
    editEvent: 'Editar Evento',
    createEvent: 'Crear Evento',
    addMoment: 'Añadir un momento',
    createNewEvent: 'Crear Nuevo Evento',
    eventPlaceholder: 'Introduce el título del evento',
    descriptionPlaceholder: 'Introduce la descripción del evento',
    date: 'Fecha',
    time: 'Hora',
    location: 'Ubicación',
    locationPlaceholder: 'Introduce la ubicación',
    eventDeleted: 'Evento eliminado con éxito',
    delete: 'Eliminar',
    update: 'Actualizar',
    create: 'Crear',
    event: 'evento'
  },
  
  fr: {
    welcome: 'Bienvenue dans votre voyage d\'amour',
    settings: 'Paramètres',
    logout: 'Se déconnecter',
    recentPhotos: 'Photos récentes',
    selectDayToSeeDetails: 'Sélectionnez un jour pour voir les détails',
    editPhoto: 'Modifier la photo',
    addPhoto: 'Ajouter une nouvelle photo',
    title: 'Titre',
    enterTitle: 'Entrez le titre',
    description: 'Description',
    enterDescription: 'Entrez la description',
    image: 'Image',
    uploadFromDevice: 'Télécharger depuis l\'appareil',
    orUseUrl: 'Ou utiliser l\'URL',
    enterImageUrl: 'Entrez l\'URL de l\'image',
    cancel: 'Annuler',
    updatePhoto: 'Mettre à jour la photo',
    savePhoto: 'Enregistrer la photo',
    sendMatchRequest: 'Envoyer une Demande de Match',
    matchRequestReceived: 'Demande de Match Reçue',
    partnerEmail: 'Email du Partenaire',
    matchRequestExplanation: 'Envoyez une demande à votre partenaire. Ils recevront un email pour accepter.',
    matchRequestFrom: 'Demande de',
    setRelationshipStartDate: 'Définir la Date de Début de Relation',
    selectDate: 'Sélectionner une Date',
    matchDateExplanation: 'Cette date sera utilisée comme votre date d\'anniversaire.',
    sendRequest: 'Envoyer la Demande',
    decline: 'Refuser',
    accept: 'Accepter',
    pendingRequests: 'Demandes en Attente',
    emailRequired: 'L\'email est requis',
    invalidEmail: 'Veuillez saisir un email valide',
    cannotMatchSelf: 'Vous ne pouvez pas vous associer à vous-même',
    startDateRequired: 'La date de début est requise',
    requestAccepted: 'Demande de match acceptée !',
    requestDeclined: 'Demande de match refusée',
    errorAcceptingRequest: 'Erreur lors de l\'acceptation de la demande',
    errorDecliningRequest: 'Erreur lors du refus de la demande',
    titleRequired: 'Le titre est requis',
    imageRequired: 'L\'image est requise',
    photoUpdated: 'Photo mise à jour avec succès',
    photoAdded: 'Photo ajoutée avec succès',
    errorSavingPhoto: 'Erreur lors de l\'enregistrement de la photo',
    userNotFound: 'Utilisateur non trouvé',
    invalidPassword: 'Mot de passe invalide',
    loginSuccess: 'Connexion réussie !',
    loginError: 'Erreur de connexion',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    emailExists: 'Cet email existe déjà',
    registrationSuccess: 'Inscription réussie !',
    registrationError: 'Erreur lors de l\'inscription',
    photoAlbum: 'Album photo',
    noPhotos: 'Pas encore de photos. Ajoutez votre premier souvenir !',
    events: 'Événements',
    photos: 'Photos',
    addEvent: 'Ajouter un événement',
    noEventsForThisDay: 'Pas d\'événements pour ce jour',
    noPhotosForThisDay: 'Pas de photos pour ce jour',
    editEvent: 'Modifier l\'événement',
    createEvent: 'Créer un événement',
    addMoment: 'Ajouter un moment',
    createNewEvent: 'Créer un nouvel événement',
    eventPlaceholder: 'Entrez le titre de l\'événement',
    descriptionPlaceholder: 'Entrez la description de l\'événement',
    date: 'Date',
    time: 'Heure',
    location: 'Lieu',
    locationPlaceholder: 'Entrez le lieu',
    eventDeleted: 'Événement supprimé avec succès',
    delete: 'Supprimer',
    update: 'Mettre à jour',
    create: 'Créer',
    event: 'événement'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Languages>('en');

  useEffect(() => {
    // Load language preference from localStorage or settings
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const { language: storedLanguage } = JSON.parse(storedSettings);
        if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es' || storedLanguage === 'fr')) {
          setLanguage(storedLanguage as Languages);
        }
      } catch (error) {
        console.error("Error parsing language settings:", error);
      }
    }
  }, []);

  const changeLanguage = (lang: Languages) => {
    setLanguage(lang);
    
    // Update language in settings
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        settings.language = lang;
        localStorage.setItem("eralove-settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Error updating language in settings:", error);
      }
    } else {
      // Create new settings if none exist
      localStorage.setItem("eralove-settings", JSON.stringify({ language: lang }));
    }
  };

  const t = (key: TranslationKey): string => {
    const langTranslations = translations[language] || translations['en'];
    return langTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

