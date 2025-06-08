import { useSelector } from 'react-redux';
import { RootState } from '@/Redux Store';
import { themePalette } from '@/lib/themePalette';

export const useThemePalette = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  return isDarkMode ? themePalette.dark : themePalette.light;
};
