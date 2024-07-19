import { SunIcon, MoonIcon } from '../../src/assets/index';

interface DarkModeButton {
  theme: string
  changeTheme: () => void
}

export default function DarkModeButton(props: DarkModeButton) {
  return (
    <div
      onClick={props.changeTheme}
      className="hidden sm:flex items-center cursor-pointer
      bg-gradient-to-r from-yellow-300 to-yellow-600 dark:from-gray-500 dark:to-gray-900 w-14 h-8 p-1 rounded-full relative transition-all duration-300"
    >
      <div
        className={`flex items-center justify-center w-6 h-6 bg-white dark:bg-black text-yellow-600 dark:text-gray-300 rounded-full transition-all duration-300 transform ${
          props.theme === 'dark' ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {props.theme === 'dark' ? SunIcon : MoonIcon}
      </div>
    </div>
  );
}