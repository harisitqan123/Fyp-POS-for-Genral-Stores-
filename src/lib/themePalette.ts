// lib/themePalette.ts

export const themePalette = {
  light: {
    settings: {
      background: 'bg-white',
      text: 'text-gray-900',
    },
    background: '#fff',
    text: '#1a1a1a',
    cardBg: 'bg-white',
    cardBgColor: '#fff',
    cardText: '#1a1a1a',
    tableRowBg: '#fff',
    tableRowText: '#1a1a1a',
    tableRowHoverBg: '#fef9c3', // Table row hover background (light yellow)
    tableHeaderBg: 'bg-yellow-100', // <-- Added for table header
    tableHead: 'text-yellow-900',   // <-- Added for table head text
    rowHover: 'hover:bg-yellow-50', // <-- Added for row hover
    textPrimary: 'text-gray-900',   // <-- Added for main text
    textSecondary: 'text-gray-500', // <-- Added for secondary text
    heading: 'text-yellow-700',
    sidebar: {
      background: 'bg-gradient-to-b from-yellow-300 to-red-400',
      text: 'text-red-900',
      toggleBg: 'bg-yellow-400',
      toggleText: 'text-red-800',
      toggleHoverBg: 'hover:bg-red-500',
      toggleHoverText: 'hover:text-white',
      itemHoverBg: 'hover:bg-yellow-200',
      itemHoverText: 'hover:text-red-800',
      itemActiveBg: 'bg-red-500',
      itemActiveText: 'text-white',
    },
    button: {
      primary: 'bg-orange-500 text-white hover:bg-orange-600',
      secondary: 'bg-white text-orange-600 hover:bg-orange-100',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
    },
    card: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
    },
    input: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-300',
      placeholder: 'placeholder-gray-500',
    },
  },

  dark: {
    settings: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
    },
      background: '#18181b',
    text: '#f3f4f6',
    cardBg: 'bg-black',
    cardBgColor: '#18181b',
    cardText: '#f3f4f6',
    tableRowBg: '#232326',
    tableRowText: '#f3f4f6',
    tableRowHoverBg: '#27272a', // Table row hover background (dark gray)
    tableHeaderBg: 'bg-yellow-900', // <-- Added for table header
    tableHead: 'text-yellow-400',   // <-- Added for table head text
    rowHover: 'hover:bg-yellow-900', // <-- Added for row hover
    textPrimary: 'text-gray-100',   // <-- Added for main text
    textSecondary: 'text-gray-400', // <-- Added for secondary text
    heading: 'text-yellow-400',
    sidebar: {
      background: 'bg-gradient-to-b from-red-900 to-yellow-700',
      text: 'text-yellow-100',
      toggleBg: 'bg-yellow-600',
      toggleText: 'text-white',
      toggleHoverBg: 'hover:bg-yellow-500',
      toggleHoverText: 'hover:text-black',
      itemHoverBg: 'hover:bg-red-800',
      itemHoverText: 'hover:text-yellow-200',
      itemActiveBg: 'bg-yellow-400',
      itemActiveText: 'text-black',
    },
    button: {
      primary: 'bg-white text-black hover:bg-gray-200',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    },
    card: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-gray-700',
    },
    input: {
      bg: 'bg-gray-800',
      text: 'text-white',
      border: 'border-gray-600',
      placeholder: 'placeholder-gray-400',
    },
  },
};
