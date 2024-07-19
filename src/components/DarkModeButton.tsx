import { SunIcon, MoonIcon } from '../../src/assets/index';

interface DarkModeButton {
  theme: string
  changeTheme: () => void
}

export default function DarkModeButton(props: DarkModeButton) {
  return props.theme === 'dark' ? (
    <div onClick={props.changeTheme} className="hidden sm:flex items-center cursor-pointer
    bg-gradient-to-r from-yellow-300 to-yellow-600 w-14 h-8 p-1 rounded-full">
      <div className="flex items-center justify-center bg-white text-yellow-600 size-6 rounded-full transition-all duration-300 transform translate-x-0">
        {SunIcon}
      </div>
      <div className="hidden lg:flex items-center ml-2 text-white">
      </div>
    </div>
  ) : (
    <div onClick={props.changeTheme} className="hidden sm:flex justify-end items-center cursor-pointer
    bg-gradient-to-r from-gray-500 to-gray-900 w-14 h-8 p-1 rounded-full">
      <div className="hidden lg:flex items-center mr-2 text-white">
      </div>
      <div className="flex items-center justify-center bg-black text-gray-300 size-6 rounded-full transition-all duration-300 transform translate-x-6">
        {MoonIcon}
      </div>
    </div>
  )
};