import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to your love journey",
    settings: "Settings",
    events: "Events",
    photos: "Photos",
    logout: "Logout",
    recentPhotos: "Recent Photos",
    addEvent: "Add New Event",
    addPhoto: "Add New Photo",
    selectDayToSeeDetails: "Select a day to see details",
    noEventsForThisDay: "No events for this day",
    noPhotosForThisDay: "No photos for this day",
    title: "Title",
    description: "Description",
    date: "Date",
    time: "Time",
    location: "Location",
    cancel: "Cancel",
    save: "Save",
    saveEvent: "Save Event",
    updateEvent: "Update Event",
    editEvent: "Edit Event",
    enterTitle: "Enter title",
    enterDescription: "Enter description",
    enterLocation: "Enter location",
    titleRequired: "Title is required",
    eventAdded: "Event added successfully",
    eventUpdated: "Event updated successfully",
    errorSavingEvent: "Error saving event",
    editPhoto: "Edit Photo",
    savePhoto: "Save Photo",
    updatePhoto: "Update Photo",
    image: "Image",
    enterImageUrl: "Enter image URL",
    imageRequired: "Image is required",
    photoAdded: "Photo added successfully",
    photoUpdated: "Photo updated successfully",
    errorSavingPhoto: "Error saving photo",
    uploadFromDevice: "Upload from device",
    orUseUrl: "Or use URL",
  },
  es: {
    welcome: "Bienvenido a tu viaje de amor",
    settings: "Configuración",
    events: "Eventos",
    photos: "Fotos",
    logout: "Cerrar sesión",
    recentPhotos: "Fotos recientes",
    addEvent: "Añadir nuevo evento",
    addPhoto: "Añadir nueva foto",
    selectDayToSeeDetails: "Selecciona un día para ver detalles",
    noEventsForThisDay: "No hay eventos para este día",
    noPhotosForThisDay: "No hay fotos para este día",
    title: "Título",
    description: "Descripción",
    date: "Fecha",
    time: "Hora",
    location: "Ubicación",
    cancel: "Cancelar",
    save: "Guardar",
    saveEvent: "Guardar evento",
    updateEvent: "Actualizar evento",
    editEvent: "Editar evento",
    enterTitle: "Ingrese título",
    enterDescription: "Ingrese descripción",
    enterLocation: "Ingrese ubicación",
    titleRequired: "El título es obligatorio",
    eventAdded: "Evento agregado con éxito",
    eventUpdated: "Evento actualizado con éxito",
    errorSavingEvent: "Error al guardar el evento",
    editPhoto: "Editar foto",
    savePhoto: "Guardar foto",
    updatePhoto: "Actualizar foto",
    image: "Imagen",
    enterImageUrl: "Ingrese URL de imagen",
    imageRequired: "La imagen es obligatoria",
    photoAdded: "Foto agregada con éxito",
    photoUpdated: "Foto actualizada con éxito",
    errorSavingPhoto: "Error al guardar la foto",
    uploadFromDevice: "Subir desde dispositivo",
    orUseUrl: "O usar URL",
  },
  fr: {
    welcome: "Bienvenue dans votre voyage d'amour",
    settings: "Paramètres",
    events: "Événements",
    photos: "Photos",
    logout: "Se déconnecter",
    recentPhotos: "Photos récentes",
    addEvent: "Ajouter un nouvel événement",
    addPhoto: "Ajouter une nouvelle photo",
    selectDayToSeeDetails: "Sélectionnez un jour pour voir les détails",
    noEventsForThisDay: "Aucun événement pour ce jour",
    noPhotosForThisDay: "Aucune photo pour ce jour",
    title: "Titre",
    description: "Description",
    date: "Date",
    time: "Heure",
    location: "Lieu",
    cancel: "Annuler",
    save: "Enregistrer",
    saveEvent: "Enregistrer l'événement",
    updateEvent: "Mettre à jour l'événement",
    editEvent: "Modifier l'événement",
    enterTitle: "Entrez le titre",
    enterDescription: "Entrez la description",
    enterLocation: "Entrez le lieu",
    titleRequired: "Le titre est obligatoire",
    eventAdded: "Événement ajouté avec succès",
    eventUpdated: "Événement mis à jour avec succès",
    errorSavingEvent: "Erreur lors de l'enregistrement de l'événement",
    editPhoto: "Modifier la photo",
    savePhoto: "Enregistrer la photo",
    updatePhoto: "Mettre à jour la photo",
    image: "Image",
    enterImageUrl: "Entrez l'URL de l'image",
    imageRequired: "L'image est obligatoire",
    photoAdded: "Photo ajoutée avec succès",
    photoUpdated: "Photo mise à jour avec succès",
    errorSavingPhoto: "Erreur lors de l'enregistrement de la photo",
    uploadFromDevice: "Télécharger depuis l'appareil",
    orUseUrl: "Ou utiliser l'URL",
  },
  de: {
    welcome: "Willkommen zu deiner Liebesreise",
    settings: "Einstellungen",
    events: "Veranstaltungen",
    photos: "Fotos",
    logout: "Ausloggen",
    recentPhotos: "Neueste Fotos",
    addEvent: "Neues Ereignis hinzufügen",
    addPhoto: "Neues Foto hinzufügen",
    selectDayToSeeDetails: "Wähle einen Tag, um Details anzuzeigen",
    noEventsForThisDay: "Keine Ereignisse für diesen Tag",
    noPhotosForThisDay: "Keine Fotos für diesen Tag",
    title: "Titel",
    description: "Beschreibung",
    date: "Datum",
    time: "Zeit",
    location: "Ort",
    cancel: "Abbrechen",
    save: "Speichern",
    saveEvent: "Ereignis speichern",
    updateEvent: "Ereignis aktualisieren",
    editEvent: "Ereignis bearbeiten",
    enterTitle: "Titel eingeben",
    enterDescription: "Beschreibung eingeben",
    enterLocation: "Ort eingeben",
    titleRequired: "Titel ist erforderlich",
    eventAdded: "Ereignis erfolgreich hinzugefügt",
    eventUpdated: "Ereignis erfolgreich aktualisiert",
    errorSavingEvent: "Fehler beim Speichern des Ereignisses",
    editPhoto: "Foto bearbeiten",
    savePhoto: "Foto speichern",
    updatePhoto: "Foto aktualisieren",
    image: "Bild",
    enterImageUrl: "Bild-URL eingeben",
    imageRequired: "Bild ist erforderlich",
    photoAdded: "Foto erfolgreich hinzugefügt",
    photoUpdated: "Foto erfolgreich aktualisiert",
    errorSavingPhoto: "Fehler beim Speichern des Fotos",
    uploadFromDevice: "Vom Gerät hochladen",
    orUseUrl: "Oder URL verwenden",
  },
  zh: {
    welcome: "欢迎开始您的爱情旅程",
    settings: "设置",
    events: "事件",
    photos: "照片",
    logout: "登出",
    recentPhotos: "最近的照片",
    addEvent: "添加新事件",
    addPhoto: "添加新照片",
    selectDayToSeeDetails: "选择一天以查看详细信息",
    noEventsForThisDay: "今天没有事件",
    noPhotosForThisDay: "今天没有照片",
    title: "标题",
    description: "描述",
    date: "日期",
    time: "时间",
    location: "地点",
    cancel: "取消",
    save: "保存",
    saveEvent: "保存事件",
    updateEvent: "更新事件",
    editEvent: "编辑事件",
    enterTitle: "输入标题",
    enterDescription: "输入描述",
    enterLocation: "输入地点",
    titleRequired: "标题是必需的",
    eventAdded: "事件添加成功",
    eventUpdated: "事件更新成功",
    errorSavingEvent: "保存事件时出错",
    editPhoto: "编辑照片",
    savePhoto: "保存照片",
    updatePhoto: "更新照片",
    image: "图片",
    enterImageUrl: "输入图片网址",
    imageRequired: "图片是必需的",
    photoAdded: "照片添加成功",
    photoUpdated: "照片更新成功",
    errorSavingPhoto: "保存照片时出错",
    uploadFromDevice: "从设备上传",
    orUseUrl: "或使用网址",
  },
};

const defaultLanguage = "en";

const LanguageContext = createContext<LanguageContextType>({
  t: () => "",
  changeLanguage: () => {},
  currentLanguage: defaultLanguage,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  useEffect(() => {
    // Load language preference from localStorage or settings
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const { language } = JSON.parse(storedSettings);
        if (language) {
          setCurrentLanguage(language);
        }
      } catch (error) {
        console.error("Error parsing language settings:", error);
      }
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    
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

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage] || translations[defaultLanguage];
    return langTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, changeLanguage, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
