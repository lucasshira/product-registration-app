interface LoadingProps {
  size: number
}

const Loading = (props: LoadingProps) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className={props.size === 2 ? "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-500 mt-5" : 
        "animate-spin rounded-full h-5 w-5 border-t-4 border-b-4 border-gray-300"}>
        </div>
    </div>
  );
}
 
export default Loading;