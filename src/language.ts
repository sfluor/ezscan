// Type that declares what a language should implement
interface Typography {
  welcome: string;
  shortDescription: string;
  startScanning: string;
  moreInfos: string;
  infos: {
    free: string;
    noAds: string;
    fast: string;
    privacy: string;
    lightweight: string;
    auditable: {
      header: string;
      openSource: string;
      end: string;
    };
  };
  changeLanguage: string;
  actions: {
    scan: string;
    back: string;
    undo: string;
    rotateLeft: string;
    rotateRight: string;
    crop: string;
    next: string;
    add: string;
    reset: string;
    save: string;
    remove: string;
  };
  scan: string;
  scannedPages: string;
  page: (plural: boolean) => string;
  scanPageDescription: string;
  editFilename: string;
  loading: string;
}

export interface Language {
  name: string;
  key: string;
  flag: string;
  typography: Typography;
}

const french: Language = {
  name: 'Français',
  key: 'fr',
  flag: '\uD83C\uDDEB\uD83C\uDDF7',
  typography: {
    welcome: 'Bienvenue sur Easy Scan !',
    shortDescription:
      'Easy scan est un outil qui permet de scanner plusieurs images et de les sauvegarder sous format PDF.',
    startScanning: 'Commencez à scanner !',
    moreInfos: "Plus d'informations sur l'outil",
    infos: {
      free: '💶 Gratuit: scanner des documents est entièrement gratuit !',
      noAds:
        '📰 Pas de publicités: Easy Scan ne contient ni publicités ni annonces.',
      fast: '🔥 Rapide: cela prend quelques secondes pour scanner et sauvegarder ses documents.',
      privacy:
        '🔒 Respectueux de la vie privée: les documents scannés restent sur votre appareil et ne sont pas envoyés à un serveur distant.',
      lightweight:
        "🪶 Léger: disponible via votre navigateur directement, ne nécessite pas d'installer une application.",
      auditable: {
        header: '💻 Vérifiable: le',
        openSource: 'projet étant open source',
        end: 'vous pouvez vérifier ce qui sera exécuté sur votre appareil.',
      },
    },
    changeLanguage: 'Changer de langue',
    actions: {
      scan: 'Scanner',
      back: 'Retour',
      undo: 'Annuler',
      rotateLeft: 'Pivot gauche',
      rotateRight: 'Pivot droite',
      crop: 'Rogner',
      next: 'Suivant',
      add: 'Ajouter',
      reset: 'Tout annuler',
      save: 'Sauvegarder',
      remove: 'Supprimer',
    },
    scan: 'Scan',
    scannedPages: 'Pages scannées',
    page: (plural: boolean) => `page${plural ? 's' : ''}`,
    scanPageDescription:
      'Vous pouvez réordonner les pages (glisser déposer) et supprimer les pages que vous ne voulez pas inclure dans le PDF final.',
    editFilename: 'Modifier le nom du fichier',
    loading: 'Image en cours de traitement...',
  },
};

const english: Language = {
  name: 'English',
  key: 'en',
  flag: '\uD83C\uDDEC\uD83C\uDDE7',
  typography: {
    welcome: 'Welcome on Easy Scan !',
    shortDescription:
      'Easy Scan is a tool to scan and edit multiple images and save them as a PDF files.',
    startScanning: 'Start scanning !',
    moreInfos: 'More infos on the tool',
    infos: {
      free: '💵 Free: scanning documents is free !',
      noAds: '📰 No Ads: Easy Scan does not contain any advertisements.',
      fast: '🔥 Fast: takes seconds to scan and save documents as PDFs.',
      privacy:
        '🔒 Privacy friendly: everything stays on your device, nothing is uploaded to a server.',
      lightweight:
        '🪶 Lightweight: available via your browser directly, no app download required.',
      auditable: {
        header: '💻 Auditable: the',
        openSource: 'project is open source',
        end: 'so you can check what is really executed on your device.',
      },
    },
    changeLanguage: 'Change language',
    actions: {
      scan: 'Scan',
      back: 'Back',
      undo: 'Undo',
      rotateLeft: 'Rotate left',
      rotateRight: 'Rotate right',
      crop: 'Crop',
      next: 'Next',
      add: 'Add',
      reset: 'Reset',
      save: 'Save',
      remove: 'Remove',
    },
    scan: 'Scan',
    scannedPages: 'Scanned pages',
    page: (plural: boolean) => `page${plural ? 's' : ''}`,
    scanPageDescription:
      'You can re-order the scans by dragging them (you can also remove the ones you do not want anymore).',
    editFilename: 'Edit filename',
    loading: 'Processing image...',
  },
};

export const languages: Array<Language> = [french, english];

const LANGUAGE_KEY = 'language_key';

export const changeLanguage = (language: Language) => {
  localStorage.setItem(LANGUAGE_KEY, language.key);
  window.location.reload(); // Refresh the page
};

const currentLanguage = (): Language => {
  // If a key is set and correspond to a language then use that one
  const savedLang = localStorage.getItem(LANGUAGE_KEY);
  if (savedLang) {
    const foundLang = languages.find((lang) => lang.key === savedLang);
    if (foundLang) {
      return foundLang;
    }
  }

  // Otherwise fallback to navigator language
  const navLang = navigator.language.split('-')[0].toLowerCase();

  return (
    languages.find((lang) => lang.key.toLowerCase() === navLang) || english
  );
};

const current = currentLanguage();
export const { typography } = current;

export default current;
