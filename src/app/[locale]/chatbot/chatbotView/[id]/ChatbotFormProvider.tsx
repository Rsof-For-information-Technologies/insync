"use client"

import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

function ChatbotFormProvider({ children }: { children: React.ReactNode }) {
    const form = useForm()

    return (
        <FormProvider {...form}>
            {children}
        </FormProvider>
    )
}

export default ChatbotFormProvider