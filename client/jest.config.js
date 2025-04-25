module.exports = {
    testEnvironment: "jsdom", // Nécessaire pour simuler un environnement navigateur
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // Utilisation de babel pour transformer les fichiers
    },
    moduleNameMapper: {
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom",  // Forcer la résolution de react-router-dom
      "\\.(css|less|scss)$": "identity-obj-proxy",  // Mocker les imports CSS
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Ajouter des matchers personnalisés pour les tests
  };
  