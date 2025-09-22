type CheckButtonProps = {
  isChecked: boolean;
}
export default function CheckButton({isChecked}: CheckButtonProps) {
  return (
    <div>
      <button className="h-5 w-5 bg-zinc-100/40 rounded-sm border-1 border-zinc-300/60 inset-shadow-xs inset-shadow-zinc-200/70 flex justify-center align-center pl-[1px] pt-[1px]">
        {isChecked && (
            <img src="/tick-icon.svg" className="opacity-100 w-4 h-4"/>
        )}
          </button>
    </div>
  );
}