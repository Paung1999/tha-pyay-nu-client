export default function Loading() {
    return (
        <div className="flex items-center justify-center w-full min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-950 dark:border-gray-600 dark:border-t-blue-500 rounded-full animate-spin">
                Loading...
            </div>
        </div>
    );
}
