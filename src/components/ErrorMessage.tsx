import { ReactNode } from "react"

type ErrorMessageProps = {
    children: ReactNode
}

export default function ErrorMessage({children } : ErrorMessageProps) {
    return (
        <p className="bg-red-600 text-white p-2 font-bold text-sm text-center">{children}</p>
    )
}
