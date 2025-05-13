
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Base translations (can be expanded)
const translations: Translations = {
  en: {
    welcome: "Welcome back",
    yourSpecialMoments: "Your Special Moments",
    noEvents: "No events yet. Click on a date in the calendar to create your first memory.",
    logout: "Logout",
    createEvent: "Create Event",
    updateEvent: "Update Event",
    deleteEvent: "Delete Event",
    settings: "Settings",
    photoAlbum: "Photo Album",
    saveSettings: "Save Settings",
    cancel: "Cancel"
  },
  es: {
    welcome: "Bienvenido de nuevo",
    yourSpecialMoments: "Tus Momentos Especiales",
    noEvents: "Aún no hay eventos. Haz clic en una fecha en el calendario para crear tu primer recuerdo.",
    logout: "Cerrar sesión",
    createEvent: "Crear Evento",
    updateEvent: "Actualizar Evento",
    deleteEvent: "Eliminar Evento",
    settings: "Configuración",
    photoAlbum: "Álbum de Fotos",
    saveSettings: "Guardar Configuración",
    cancel: "Cancelar"
  },
  fr: {
    welcome: "Bienvenue",
    yourSpecialMoments: "Vos Moments Spéciaux",
    noEvents: "Pas encore d'événements. Cliquez sur une date dans le calendrier pour créer votre premier souvenir.",
    logout: "Déconnexion",
    createEvent: "Créer un Événement",
    updateEvent: "Mettre à jour l'Événement",
    deleteEvent: "Supprimer l'Événement",
    settings: "Paramètres",
    photoAlbum: "Album Photo",
    saveSettings: "Enregistrer les Paramètres",
    cancel: "Annuler"
  },
  de: {
    welcome: "Willkommen zurück",
    yourSpecialMoments: "Deine besonderen Momente",
    noEvents: "Noch keine Ereignisse. Klicke auf ein Datum im Kalender, um deine erste Erinnerung zu erstellen.",
    logout: "Abmelden",
    createEvent: "Ereignis erstellen",
    updateEvent: "Ereignis aktualisieren",
    deleteEvent: "Ereignis löschen",
    settings: "Einstellungen",
    photoAlbum: "Fotoalbum",
    saveSettings: "Einstellungen speichern",
    cancel: "Abbrechen"
  },
  zh: {
    welcome: "欢迎回来",
    yourSpecialMoments: "你的特别时刻",
    noEvents: "还没有活动。点击日历中的日期创建你的第一个回忆。",
    logout: "登出",
    createEvent: "创建活动",
    updateEvent: "更新活动",
    deleteEvent: "删除活动",
    settings: "设置",
    photoAlbum: "相册",
    saveSettings: "保存设置",
    cancel: "取消"
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Load language preference from localStorage
    const storedSettings = localStorage.getItem("eralove-settings");
    if (storedSettings) {
      try {
        const { language } = JSON.parse(storedSettings);
        if (language && translations[language]) {
          setLanguage(language);
        }
      } catch (error) {
        console.error("Error loading language settings:", error);
      }
    }
  }, []);

  // Translation function
  const t = (key: string): string => {
    if (!translations[language]) return translations.en[key] || key;
    return translations[language][key] || translations.en[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
