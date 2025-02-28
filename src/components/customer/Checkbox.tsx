import React, { ReactNode } from "react";
interface CheckboxCustomProps {
  label: string;
  img?: ReactNode;
  setChecked:React.Dispatch<React.SetStateAction<boolean>>;
  checked:boolean;
  click:boolean;
}

const CheckboxCustom: React.FC<CheckboxCustomProps> = ({ label, img,setChecked,checked,click }) => {
  const handleCheck=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setChecked(e.target.checked)
  }
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={label}
        name="A3-confirmation"
        value={label}
        checked={checked}
        className="opacity-0 absolute h-8 w-8"
        onChange={handleCheck}
      />
      <div className="bg-white border border-gray-400  w-5 h-5 flex shrink-0 justify-center items-center mr-2 focus-within:border-[var(--primary)]">
        <svg
          className="fill-current hidden w-[10px] h-[10px] text-primary pointer-events-none"
          version="1.1"
          viewBox="0 0 17 12"
          xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(-9 -11)" fill="#363AED" fillRule="nonzero">
              <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
            </g>
          </g>
        </svg>
      </div>
      <label
        htmlFor={label}
        className={`select-none flex gap-2 cursor-pointer ${(click)? ("text-red-500"):("")} items-center`}>
        {img && <span>{img}</span>}
        {label}
      </label>
    </div>
  );
};

export default CheckboxCustom;
