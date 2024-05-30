interface LoadingProps {
  size: number
  darkMode?: boolean
}

const Loading = (props: LoadingProps) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className={props.size === 2 ? `animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 ${props.darkMode ? 'border-gray-100' : 'border-gray-800'} mt-5` : 
        `animate-spin rounded-full h-5 w-5 border-t-4 border-b-4 ${props.darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        </div>
    </div>
  );
}

export default Loading;