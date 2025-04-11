export default function Loading() {
    return (
        <div className="min-h-40 flex w-full items-center justify-center">
            <div className="min-h-40 flex w-full items-center justify-center">
                <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-primary-300 to-primary-900 ">
                    <div className="h-9 w-9 rounded-full bg-neutral-725"></div>
                </div>
            </div>
        </div>
    );
}
