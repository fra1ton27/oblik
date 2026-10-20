import type { UseFormRegisterReturn } from 'react-hook-form'

/** Скрытое поле-ловушка для ботов: люди его не видят и не заполняют */
export function Honeypot({ register }: { register: UseFormRegisterReturn }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <input type="text" tabIndex={-1} autoComplete="off" {...register} />
    </div>
  )
}
