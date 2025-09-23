import { Params } from '@/types/params'
import waitFor from '@/utils/waitFor'
import React from 'react'
import Editor from '../_components/Editor'

type ChatbotEditorPageProps = Params & {
    chatbotId: string
}

async function page({ params }: { params: ChatbotEditorPageProps }) {

    const { locale, chatbotId } = params;

    if (!locale || !chatbotId) {
        return <div>No chatbot found</div>
    }

    return <Editor workFlow={<div>Editing chatbot {chatbotId} in locale {locale}</div>} />
}

export default page