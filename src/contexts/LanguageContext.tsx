
import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "en" | "es" | "fr" | "de" | "zh";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  welcome: {
    en: "Welcome to Your Love Journey",
    es: "Bienvenido a tu viaje de amor",
    fr: "Bienvenue dans votre voyage d'amour",
    de: "Willkommen zu deiner Liebesreise",
    zh: "欢迎来到你的爱情旅程"
  },
  settings: {
    en: "Settings",
    es: "Configuraciones",
    fr: "Paramètres",
    de: "Einstellungen",
    zh: "设置"
  },
  yourSpecialMoments: {
    en: "Your Special Moments",
    es: "Tus momentos especiales",
    fr: "Vos moments spéciaux",
    de: "Deine besonderen Momente",
    zh: "你的特别时刻"
  },
  noEvents: {
    en: "No events yet. Click on a day to create one.",
    es: "Aún no hay eventos. Haga clic en un día para crear uno.",
    fr: "Pas encore d'événements. Cliquez sur un jour pour en créer un.",
    de: "Noch keine Ereignisse. Klicke auf einen Tag, um eines zu erstellen.",
    zh: "还没有事件。点击一天来创建一个。"
  },
  logout: {
    en: "Logout",
    es: "Cerrar sesión",
    fr: "Déconnexion",
    de: "Abmelden",
    zh: "登出"
  },
  cancel: {
    en: "Cancel",
    es: "Cancelar",
    fr: "Annuler",
    de: "Abbrechen",
    zh: "取消"
  },
  save: {
    en: "Save",
    es: "Guardar",
    fr: "Sauvegarder",
    de: "Speichern",
    zh: "保存"
  },
  delete: {
    en: "Delete",
    es: "Eliminar",
    fr: "Supprimer",
    de: "Löschen",
    zh: "删除"
  },
  update: {
    en: "Update",
    es: "Actualizar",
    fr: "Mettre à jour",
    de: "Aktualisieren",
    zh: "更新"
  },
  create: {
    en: "Create",
    es: "Crear",
    fr: "Créer",
    de: "Erstellen",
    zh: "创建"
  },
  event: {
    en: "Event",
    es: "Evento",
    fr: "Événement",
    de: "Ereignis",
    zh: "事件"
  },
  photoAlbum: {
    en: "Photo Album",
    es: "Álbum de fotos",
    fr: "Album photo",
    de: "Fotoalbum",
    zh: "相册"
  },
  addPhoto: {
    en: "Add New Photo",
    es: "Añadir nueva foto",
    fr: "Ajouter une nouvelle photo",
    de: "Neues Foto hinzufügen",
    zh: "添加新照片"
  },
  noPhotos: {
    en: "No photos added yet",
    es: "Aún no se han añadido fotos",
    fr: "Aucune photo ajoutée pour le moment",
    de: "Noch keine Fotos hinzugefügt",
    zh: "尚未添加照片"
  },
  title: {
    en: "Title",
    es: "Título",
    fr: "Titre",
    de: "Titel",
    zh: "标题"
  },
  description: {
    en: "Description",
    es: "Descripción",
    fr: "Description",
    de: "Beschreibung",
    zh: "描述"
  },
  date: {
    en: "Date",
    es: "Fecha",
    fr: "Date",
    de: "Datum",
    zh: "日期"
  },
  time: {
    en: "Time",
    es: "Hora",
    fr: "Heure",
    de: "Zeit",
    zh: "时间"
  },
  location: {
    en: "Location",
    es: "Ubicación",
    fr: "Lieu",
    de: "Standort",
    zh: "位置"
  },
  editEvent: {
    en: "Edit Event",
    es: "Editar evento",
    fr: "Modifier l'événement",
    de: "Ereignis bearbeiten",
    zh: "编辑事件"
  },
  createEvent: {
    en: "Create New Event",
    es: "Crear nuevo evento",
    fr: "Créer un nouvel événement",
    de: "Neues Ereignis erstellen",
    zh: "创建新事件"
  },
  addMoment: {
    en: "Add a special moment for",
    es: "Añadir un momento especial para",
    fr: "Ajouter un moment spécial pour",
    de: "Füge einen besonderen Moment hinzu für",
    zh: "为以下日期添加特别时刻"
  },
  createNewEvent: {
    en: "Create a new event for your love journey",
    es: "Crear un nuevo evento para tu viaje de amor",
    fr: "Créer un nouvel événement pour votre voyage d'amour",
    de: "Erstellen Sie ein neues Ereignis für Ihre Liebesreise",
    zh: "为你的爱情旅程创建一个新事件"
  },
  eventPlaceholder: {
    en: "Dinner Date, Anniversary, etc.",
    es: "Cena, Aniversario, etc.",
    fr: "Dîner, Anniversaire, etc.",
    de: "Abendessen, Jahrestag, usw.",
    zh: "晚餐约会、周年纪念日等"
  },
  descriptionPlaceholder: {
    en: "Write about this special moment...",
    es: "Escribe sobre este momento especial...",
    fr: "Écrivez à propos de ce moment spécial...",
    de: "Schreibe über diesen besonderen Moment...",
    zh: "写下这个特别时刻的故事..."
  },
  locationPlaceholder: {
    en: "Where did you meet?",
    es: "¿Dónde se conocieron?",
    fr: "Où vous êtes-vous rencontrés?",
    de: "Wo habt ihr euch getroffen?",
    zh: "你们在哪里相遇？"
  },
  eventDeleted: {
    en: "Event deleted successfully!",
    es: "¡Evento eliminado con éxito!",
    fr: "Événement supprimé avec succès!",
    de: "Ereignis erfolgreich gelöscht!",
    zh: "事件删除成功！"
  },
  language: {
    en: "Language",
    es: "Idioma",
    fr: "Langue",
    de: "Sprache",
    zh: "语言"
  },
  background: {
    en: "Background Image",
    es: "Imagen de fondo",
    fr: "Image de fond",
    de: "Hintergrundbild",
    zh: "背景图片"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or use default
    const savedLanguage = localStorage.getItem("eralove-language");
    return (savedLanguage as Language) || "en";
  });

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    
    // Fallback to English or the key itself
    return translations[key]?.["en"] || key;
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("eralove-language", newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
