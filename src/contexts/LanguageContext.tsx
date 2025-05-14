import React, { createContext, useContext, useState } from 'react';

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
  | 'registrationError';

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
    registrationError: 'Error registering'
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
    registrationError: 'Error al registrarse'
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
    registrationError: 'Erreur lors de l\'inscription'
  },
  
  de: {
    welcome: 'Willkommen zu deiner Liebesreise',
    settings: 'Einstellungen',
    logout: 'Ausloggen',
    recentPhotos: 'Neueste Fotos',
    selectDayToSeeDetails: 'Wähle einen Tag, um Details anzuzeigen',
    editPhoto: 'Foto bearbeiten',
    addPhoto: 'Neues Foto hinzufügen',
    title: 'Titel',
    enterTitle: 'Titel eingeben',
    description: 'Beschreibung',
    enterDescription: 'Beschreibung eingeben',
    image: 'Bild',
    uploadFromDevice: 'Vom Gerät hochladen',
    orUseUrl: 'Oder URL verwenden',
    enterImageUrl: 'Bild-URL eingeben',
    cancel: 'Abbrechen',
    updatePhoto: 'Foto aktualisieren',
    savePhoto: 'Foto speichern',
    sendMatchRequest: 'Senden Sie eine Partneranfrage',
    matchRequestReceived: 'Partneranfrage erhalten',
    partnerEmail: 'Partner-E-Mail',
    matchRequestExplanation: 'Senden Sie eine Partneranfrage an Ihren Partner. Sie erhalten eine E-Mail, um die Anfrage anzunehmen.',
    matchRequestFrom: 'Partneranfrage von',
    setRelationshipStartDate: 'Setzen Sie die Startdatum der Beziehung',
    selectDate: 'Datum auswählen',
    matchDateExplanation: 'Dies wird als Ihr Geburtstag verwendet.',
    sendRequest: 'Anfrage senden',
    decline: 'Ablehnen',
    accept: 'Akzeptieren',
    pendingRequests: 'Ausstehende Anfragen',
    emailRequired: 'E-Mail ist erforderlich',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail ein',
    cannotMatchSelf: 'Sie können sich nicht mit sich selbst verbinden',
    startDateRequired: 'Startdatum ist erforderlich',
    requestAccepted: 'Partneranfrage akzeptiert!',
    requestDeclined: 'Partneranfrage abgelehnt',
    errorAcceptingRequest: 'Fehler beim Akzeptieren der Anfrage',
    errorDecliningRequest: 'Fehler beim Ablehnen der Anfrage',
    titleRequired: 'Titel ist erforderlich',
    imageRequired: 'Bild ist erforderlich',
    photoUpdated: 'Foto erfolgreich aktualisiert',
    photoAdded: 'Foto erfolgreich hinzugefügt',
    errorSavingPhoto: 'Fehler beim Speichern des Fotos',
    userNotFound: 'Benutzer nicht gefunden',
    invalidPassword: 'Ungültiges Passwort',
    loginSuccess: 'Anmeldung erfolgreich!',
    loginError: 'Fehler bei der Anmeldung',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    emailExists: 'Diese E-Mail existiert bereits',
    registrationSuccess: 'Registrierung erfolgreich!',
    registrationError: 'Fehler bei der Registrierung'
  },
  
  zh: {
    welcome: '欢迎开始您的爱情旅程',
    settings: '设置',
    logout: '登出',
    recentPhotos: '最近的照片',
    selectDayToSeeDetails: '选择一天以查看详细信息',
    editPhoto: '编辑照片',
    addPhoto: '添加新照片',
    title: '标题',
    enterTitle: '输入标题',
    description: '描述',
    enterDescription: '输入描述',
    image: '图片',
    uploadFromDevice: '从设备上传',
    orUseUrl: '或使用网址',
    enterImageUrl: '输入图片网址',
    cancel: '取消',
    updatePhoto: '更新照片',
    savePhoto: '保存照片',
    sendMatchRequest: '发送匹配请求',
    matchRequestReceived: '匹配请求已收到',
    partnerEmail: '伴侣的电子邮件',
    matchRequestExplanation: '发送匹配请求给你的伴侣。他们将收到一封电子邮件来接受匹配。',
    matchRequestFrom: '匹配请求来自',
    setRelationshipStartDate: '设置关系开始日期',
    selectDate: '选择日期',
    matchDateExplanation: '这将作为你的生日日期使用。',
    sendRequest: '发送请求',
    decline: '拒绝',
    accept: '接受',
    pendingRequests: '待处理请求',
    emailRequired: '电子邮件是必需的',
    invalidEmail: '请输入有效的电子邮件',
    cannotMatchSelf: '您不能与自己匹配',
    startDateRequired: '开始日期是必需的',
    requestAccepted: '匹配请求已接受！',
    requestDeclined: '匹配请求已拒绝',
    errorAcceptingRequest: '匹配请求接受时出错',
    errorDecliningRequest: '匹配请求拒绝时出错',
    titleRequired: '标题是必需的',
    imageRequired: '图片是必需的',
    photoUpdated: '照片更新成功',
    photoAdded: '照片添加成功',
    errorSavingPhoto: '保存照片时出错',
    userNotFound: '用户未找到',
    invalidPassword: '无效密码',
    loginSuccess: '登录成功！',
    loginError: '登录失败',
    passwordMismatch: '密码不匹配',
    emailExists: '电子邮件已存在',
    registrationSuccess: '注册成功！',
    registrationError: '注册失败'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load language preference from localStorage or settings
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const { language } = JSON.parse(storedSettings);
        if (language) {
          setLanguage(language);
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
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
