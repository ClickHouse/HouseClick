export default function Loading() {
  return (
    <div class="min-h-40 flex w-full items-center justify-center">
      <div class="min-h-40 flex w-full items-center justify-center">
        <div class="flex h-10 w-10 animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-primary-300 to-primary-900 ">
          <div class="h-9 w-9 rounded-full bg-neutral-725"></div>
        </div>
      </div>
    </div>
  );
}
