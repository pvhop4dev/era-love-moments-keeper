
import React, { createContext, useState, useContext, useEffect } from "react";

type Language = "en" | "es" | "fr" | "de" | "zh";

// Define the translation dictionary type
type TranslationDictionary = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Define the available translations
const translations: TranslationDictionary = {
  welcome: {
    en: "Welcome to your Love Journey",
    es: "Bienvenido a tu camino de amor",
    fr: "Bienvenue dans votre parcours d'amour",
    de: "Willkommen zu deiner Liebesreise",
    zh: "欢迎来到你的爱情旅程",
  },
  settings: {
    en: "Settings",
    es: "Ajustes",
    fr: "Paramètres",
    de: "Einstellungen",
    zh: "设置",
  },
  logout: {
    en: "Logout",
    es: "Cerrar sesión",
    fr: "Déconnexion",
    de: "Ausloggen",
    zh: "登出",
  },
  yourSpecialMoments: {
    en: "Your Special Moments",
    es: "Tus momentos especiales",
    fr: "Vos moments spéciaux",
    de: "Deine besonderen Momente",
    zh: "你的特别时刻",
  },
  noEvents: {
    en: "No events added yet. Click on a day to add your first special moment.",
    es: "Aún no hay eventos agregados. Haz clic en un día para agregar tu primer momento especial.",
    fr: "Aucun événement ajouté. Cliquez sur un jour pour ajouter votre premier moment spécial.",
    de: "Noch keine Ereignisse hinzugefügt. Klicke auf einen Tag, um deinen ersten besonderen Moment hinzuzufügen.",
    zh: "还没有添加事件。点击某一天添加你的第一个特别时刻。",
  },
  addPhoto: {
    en: "Add Photo",
    es: "Añadir foto",
    fr: "Ajouter une photo",
    de: "Foto hinzufügen",
    zh: "添加照片",
  },
  addEvent: {
    en: "Add Event",
    es: "Añadir evento",
    fr: "Ajouter un événement",
    de: "Ereignis hinzufügen",
    zh: "添加事件",
  },
  events: {
    en: "Events",
    es: "Eventos",
    fr: "Événements",
    de: "Ereignisse",
    zh: "活动",
  },
  photos: {
    en: "Photos",
    es: "Fotos",
    fr: "Photos",
    de: "Fotos",
    zh: "照片",
  },
  noEventsForThisDay: {
    en: "No events for this day. Add your first special moment!",
    es: "No hay eventos para este día. ¡Agrega tu primer momento especial!",
    fr: "Pas d'événements pour ce jour. Ajoutez votre premier moment spécial!",
    de: "Keine Ereignisse für diesen Tag. Füge deinen ersten besonderen Moment hinzu!",
    zh: "这一天没有活动。添加你的第一个特别时刻！",
  },
  noPhotosForThisDay: {
    en: "No photos for this day. Add your first memory!",
    es: "No hay fotos para este día. ¡Agrega tu primer recuerdo!",
    fr: "Pas de photos pour ce jour. Ajoutez votre premier souvenir!",
    de: "Keine Fotos für diesen Tag. Füge deine erste Erinnerung hinzu!",
    zh: "这一天没有照片。添加你的第一个回忆！",
  },
  selectDayToSeeDetails: {
    en: "Select a day to see events and photos",
    es: "Selecciona un día para ver eventos y fotos",
    fr: "Sélectionnez un jour pour voir les événements et les photos",
    de: "Wähle einen Tag, um Ereignisse und Fotos zu sehen",
    zh: "选择一天查看活动和照片",
  },
  recentPhotos: {
    en: "Recent Photos",
    es: "Fotos recientes",
    fr: "Photos récentes",
    de: "Neueste Fotos",
    zh: "最近的照片",
  },
  // Add more translations as needed
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
});

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("eralove-language");
    return (savedLanguage as Language) || "en";
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("eralove-language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  // Handler to change the language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
