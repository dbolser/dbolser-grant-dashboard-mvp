// Theme configuration for the dashboard
export const themes = {
  default: {
    name: 'Default',
    description: 'Purple and Indigo gradient theme',
    header: {
      gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      text: 'text-white',
      subtitleText: 'text-indigo-100',
      buttonBg: 'bg-white/20 hover:bg-white/30',
      buttonText: 'text-white'
    },
    stats: {
      bg: 'bg-gray-50',
      border: 'border-gray-200'
    },
    primary: {
      bg: 'bg-indigo-600',
      bgHover: 'hover:bg-indigo-700',
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      bgLight: 'bg-indigo-50',
      textLight: 'text-indigo-700',
      borderLight: 'border-indigo-300'
    },
    accent: {
      bg: 'bg-purple-600',
      text: 'text-purple-600'
    }
  },
  utah: {
    name: 'University of Utah',
    description: 'Official Utah red and white theme',
    header: {
      gradient: 'bg-gradient-to-r from-red-700 to-red-600',
      text: 'text-white',
      subtitleText: 'text-red-100',
      buttonBg: 'bg-white/20 hover:bg-white/30',
      buttonText: 'text-white'
    },
    stats: {
      bg: 'bg-gray-50',
      border: 'border-gray-200'
    },
    primary: {
      bg: 'bg-red-600',
      bgHover: 'hover:bg-red-700',
      text: 'text-red-600',
      border: 'border-red-600',
      bgLight: 'bg-red-50',
      textLight: 'text-red-700',
      borderLight: 'border-red-300'
    },
    accent: {
      bg: 'bg-gray-700',
      text: 'text-gray-700'
    }
  }
};

export const getTheme = (themeName) => {
  return themes[themeName] || themes.default;
};
