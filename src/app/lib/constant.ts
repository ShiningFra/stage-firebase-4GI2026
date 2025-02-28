import service from "../../../firebase/serviceAccount";
export const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  };
  
  export const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
  };
  
  export const PAPERMARK_HEADERS = {
    headers: {
      "x-powered-by":
        "Papermark.io - Document sharing infrastructure for the modern web",
    },
  };
  
  export const REACTIONS = [
    {
      emoji: "❤️",
      label: "heart",
    },
    {
      emoji: "💸",
      label: "money",
    },
    {
      emoji: "👍",
      label: "up",
    },
    {
      emoji: "👎",
      label: "down",
    },
  ];
  
  // time in milliseconds
  export const ONE_SECOND = 1000;
  export const ONE_MINUTE = ONE_SECOND * 60;
  export const ONE_HOUR = ONE_MINUTE * 60;
  export const ONE_DAY = ONE_HOUR * 24;
  export const ONE_WEEK = ONE_DAY * 7; 
  
  // free limits
  export const LIMITS = {
    views: 20,
  };
  
  export const SUPPORTED_DOCUMENT_TYPES = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/vnd.oasis.opendocument.spreadsheet",
  ];

  export const FIREBASE_CONFIG=service
