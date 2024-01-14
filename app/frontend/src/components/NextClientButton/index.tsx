'use client'

import { handleNextClient } from "@/actions/hadleNextClient";
import { Button } from "../ui/button";


type NextClientButtonProps = {
    children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function NextClientButton(props: NextClientButtonProps) {

    return (
        <Button {...props} onClick={async () => {
            handleNextClient()
        }}>{props.children}</Button>
    )
}